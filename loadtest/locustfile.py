"""The paths students take through CyberStars, one user type each, so they can
run alone or mixed. README.md next to this file says how to run it.

Every simulated student comes from its own address, sent in X-Forwarded-For,
which the app reads in production mode as it does behind nginx. So the limits
counted per address hold for each one as they do on production for real
students, and nothing is raised for the test.
"""

import itertools
import json
import random
import re
import time
from pathlib import Path

import gevent
import websocket
from gevent.pool import Pool
from locust import HttpUser, between, task

HERE = Path(__file__).parent
CONTENT = Path("/content/lessons")
# What a browser asks for on each page, written by capture.mjs (box.sh up)
PAGES = json.loads((HERE / "results" / "pages.json").read_text())
# The lesson capture.mjs opened as a student, swapped for the one opened here
CAPTURED_LESSON = "python/variables-str"
# How many requests a browser sends at once to one site over HTTP/1.1
BROWSER_CONNECTIONS = 6
# The test's own run, so the accounts of two runs on one database never meet
RUN = int(time.time())

# Fixed lessons, so two runs of the test do the same work: Run on a short
# program, Run Tests on a lesson with one case and on one with many
RUN_LESSON = {"python": "for", "c": "for", "java": "for"}
TESTS_LESSONS = {
    "python": ("print", "recap-algorithms"),
    "c": ("for", "strings-functions"),
    "java": ("print", "switch"),
}


def solution(course, slug):
    text = (CONTENT / course / f"{slug}-solution.md").read_text()
    return re.search(r"```[^\n]*\n(.*?)```", text, re.S).group(1)


def case_count(course, slug):
    return len(json.loads((CONTENT / course / f"{slug}-tests.json").read_text())["cases"])


# Every lesson a student can open in the three code courses
LESSONS = sorted(
    f"{course}/{path.name.removesuffix('-solution.md')}"
    for course in ("python", "c", "java")
    for path in (CONTENT / course).glob("*-solution.md")
)

# 10.x.y.z, starting somewhere new on every run: an address reused within 15
# minutes would carry over the sign-up limit of the run before
_addresses = itertools.count((RUN % 60_000) * 250 + 1)


def own_address():
    n = next(_addresses)
    return f"10.{n >> 16 & 255}.{n >> 8 & 255}.{n & 255}"


class Browser(HttpUser):
    """What every simulated user shares: its own address and its cookies.

    The app's cookies are Secure, which a client only sends back over HTTPS,
    so they're kept here and sent by hand, as a browser on the box (localhost)
    sends them back.
    """

    abstract = True

    def on_start(self):
        self.address = own_address()
        self.cookies = {}

    def headers(self, extra=None):
        cookie = "; ".join(f"{k}={v}" for k, v in self.cookies.items())
        return {
            "X-Forwarded-For": self.address,
            "Origin": self.host,
            **({"Cookie": cookie} if cookie else {}),
            **(extra or {}),
        }

    def call(self, method, path, name, expect=(), check=None, **kwargs):
        """One request. A status of 400 or more fails it unless it's in
        `expect`; `check` may fail it too, by returning why."""
        with self.client.request(
            method, path, name=name, headers=self.headers(kwargs.pop("headers", None)),
            catch_response=True, **kwargs,
        ) as res:
            self.cookies.update(res.cookies.get_dict())
            if res.status_code >= 400 and res.status_code not in expect:
                res.failure(f"{res.status_code} {res.text[:80]}")
            elif check and (why := check(res)):
                res.failure(why)
            else:
                res.success()
            return res

    def record(self, kind, name, ms, error=None):
        self.environment.events.request.fire(
            request_type=kind, name=name, response_time=ms, response_length=0,
            exception=Exception(error) if error else None, context={},
        )

    def load(self, page, requests, lesson=None):
        """Asks for every request a browser sent for a page: the first alone,
        as nothing else is known before it answers, then the rest
        BROWSER_CONNECTIONS at a time. Each request is recorded under its
        path, the built files together as one name, and the whole page as one
        more entry of type PAGE, from the first request to the last answer."""
        start = time.perf_counter()
        failed = []

        def one(req):
            path = req["path"]
            body = req.get("body")
            if lesson:
                path = path.replace(CAPTURED_LESSON, lesson)
                body = body and body.replace(CAPTURED_LESSON, lesson)
            shown = req["path"].replace(CAPTURED_LESSON, "[lesson]") if lesson else req["path"]
            name = f"{page}: " + ("built files" if path.startswith("/assets/") else shown)
            # A visitor's "who am I" is a 401 by design
            expect = (401,) if path == "/auth/me" else ()
            res = self.call(
                req["method"], path, name, expect=expect,
                data=body, headers={"Content-Type": "application/json"} if body else None,
            )
            if res.status_code >= 400 and res.status_code not in expect:
                failed.append(f"{res.status_code} {path}")

        one(requests[0])
        Pool(BROWSER_CONNECTIONS).map(one, requests[1:])
        self.record("PAGE", page, (time.perf_counter() - start) * 1000, ", ".join(failed) or None)


class Visitor(Browser):
    """Someone who isn't signed in, on a first visit: nothing cached yet."""

    weight = 4
    wait_time = between(5, 15)

    @task
    def landing(self):
        self.cookies = {}
        self.load("landing", PAGES["visitorLanding"])

    @task
    def lesson_page(self):
        self.cookies = {}
        self.load("lesson page", PAGES["visitorLesson"])


class SignedIn(Browser):
    """A student with an account, who signs up when they arrive and keeps the
    sockets the app holds open while it's open."""

    abstract = True

    def on_start(self):
        super().on_start()
        self.sockets = []
        self.call(
            "POST", "/auth/signup", "sign up",
            json={
                "name": f"Load Student {self.address}",
                "email": f"student-{RUN}-{self.address}@loadtest.cyberstars.app",
                "password": "loadtest-student",
            },
        )
        self.hold("/ws/user")

    def on_stop(self):
        for ws in self.sockets:
            ws.close()

    def connect(self, path, timeout):
        """A socket to the app with this student's address and cookies. The
        client sends an Origin of its own, so ours goes through its option:
        two would reach the app as one value that matches no allowed origin."""
        headers = self.headers()
        origin = headers.pop("Origin")
        return websocket.create_connection(
            self.host.replace("http", "ws", 1) + path,
            header=[f"{k}: {v}" for k, v in headers.items()],
            origin=origin,
            timeout=timeout,
        )

    def hold(self, path):
        """Opens a socket the app keeps open while a page is open, and keeps
        reading it, so a ping from the server gets its answer."""
        start = time.perf_counter()
        try:
            ws = self.connect(path, timeout=30)
        except Exception as err:
            self.record("WS", f"open {path}", (time.perf_counter() - start) * 1000, repr(err)[:120])
            return
        self.record("WS", f"open {path}", (time.perf_counter() - start) * 1000)
        ws.settimeout(None)

        def read():
            try:
                while True:
                    ws.recv()
            except Exception:
                pass

        gevent.spawn(read)
        self.sockets.append(ws)


class Student(SignedIn):
    """Opens the app, then lessons one after another from inside it, reading each."""

    weight = 4
    wait_time = between(20, 60)

    def on_start(self):
        super().on_start()
        self.load("student app", PAGES["studentApp"])

    @task
    def open_lesson(self):
        # The lesson's built files are in the browser after the first lesson
        requests = [r for r in PAGES["studentLesson"] if not r["path"].startswith("/assets/")]
        self.load("open lesson", requests, random.choice(LESSONS))


class Community(SignedIn):
    """Reads the forum and the leaderboard."""

    weight = 1
    wait_time = between(5, 15)

    @task
    def forum(self):
        categories = self.call("GET", "/api/forum/categories", "/api/forum/categories")
        if not categories.ok:
            return
        slug = random.choice(categories.json())["slug"]
        threads = self.call(
            "GET", f"/api/forum/categories/{slug}/threads", "/api/forum/categories/[slug]/threads"
        )
        listed = threads.json().get("threads", []) if threads.ok else []
        if listed:
            thread = random.choice(listed)["id"]
            self.call("GET", f"/api/forum/threads/{thread}", "/api/forum/threads/[id]")

    @task
    def leaderboard(self):
        self.call("GET", "/api/leaderboard", "/api/leaderboard")
        self.call("GET", "/api/leaderboard/me", "/api/leaderboard/me")


class Runner(SignedIn):
    """Presses Run on a lesson, over /ws/run, as the editor does. Its lesson
    page stays open (/ws/presence), which keeps its code container warm
    between runs; the first run of each student pays for starting it."""

    abstract = True
    language = None
    wait_time = between(5, 15)

    def on_start(self):
        super().on_start()
        self.hold("/ws/presence")
        self.slug = RUN_LESSON[self.language]
        self.code = solution(self.language, self.slug)
        self.runs = 0

    @task
    def press_run(self):
        name = f"run {self.language}" + (" (first)" if self.runs == 0 else "")
        self.runs += 1
        start = time.perf_counter()
        first = waited = error = None
        try:
            ws = self.connect("/ws/run", timeout=60)
            try:
                ws.send(json.dumps({
                    "type": "run", "code": self.code, "language": self.language,
                    "lesson": {"courseKey": self.language, "lessonSlug": self.slug, "lang": "en"},
                }))
                while True:
                    msg = json.loads(ws.recv())
                    kind = msg.get("type")
                    if kind == "waiting":
                        waited = time.perf_counter()
                    elif kind == "slot" and waited:
                        self.record("WAIT", f"{name}: wait for a sandbox",
                                    (time.perf_counter() - waited) * 1000)
                    elif kind in ("stdout", "stderr") and first is None:
                        first = time.perf_counter()
                    elif kind == "busy":
                        error = "busy: no free sandbox"
                        break
                    elif kind == "exit":
                        if msg.get("code") != 0:
                            error = f"exit {msg.get('code')}"
                        break
            finally:
                ws.close()
        except Exception as err:
            error = repr(err)[:120]
        self.record("WS", name, (time.perf_counter() - start) * 1000, error)
        if first and not error:
            self.record("WS", f"{name}: first output", (first - start) * 1000)


class RunPython(Runner):
    language = "python"


class RunJava(Runner):
    language = "java"


class RunC(Runner):
    language = "c"


class Tester(SignedIn):
    """Presses Run Tests with the lesson's solution, on a lesson with one case
    and on one with many, with the lesson page open as in the app."""

    abstract = True
    language = None
    wait_time = between(10, 30)

    def on_start(self):
        super().on_start()
        self.hold("/ws/presence")

    def run_tests(self, slug):
        cases = case_count(self.language, slug)
        name = f"run tests {self.language}, {cases} case" + ("" if cases == 1 else "s")
        self.call(
            "POST", f"/api/tests/{self.language}/{slug}/run", name,
            json={"code": solution(self.language, slug), "lang": "en"},
            check=lambda res: None if res.json().get("status") == "passed"
            else f"verdict {res.json().get('status')}",
        )

    @task
    def few_cases(self):
        self.run_tests(TESTS_LESSONS[self.language][0])

    @task
    def many_cases(self):
        self.run_tests(TESTS_LESSONS[self.language][1])


class TestsPython(Tester):
    language = "python"


class TestsJava(Tester):
    language = "java"


class TestsC(Tester):
    language = "c"
