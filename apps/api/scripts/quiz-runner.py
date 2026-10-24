# Runs the programs of Laniakea's question templates for make-quiz.ts, inside
# the lessons' Python image. Reads a JSON list of programs on stdin and writes a
# JSON list of runs: {"ok": true, "out": "..."} with what the program printed,
# or {"ok": false, "error": "NameError"} with what stopped it. Each program gets
# fresh globals, no input (input() fails) and 2 seconds.
import contextlib
import io
import json
import signal
import sys


class TooLong(Exception):
    pass


def too_long(_signum, _frame):
    raise TooLong()


def run(code):
    out = io.StringIO()
    signal.alarm(2)
    try:
        with contextlib.redirect_stdout(out):
            exec(compile(code, "<template>", "exec"), {"__name__": "__main__"})
        return {"ok": True, "out": out.getvalue()}
    except BaseException as e:
        return {"ok": False, "error": type(e).__name__}
    finally:
        signal.alarm(0)


signal.signal(signal.SIGALRM, too_long)
programs = json.load(sys.stdin)
sys.stdin = io.StringIO("")
runs = [run(code) for code in programs]
sys.__stdout__.write(json.dumps(runs))
