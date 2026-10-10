# Thin C judge runner, executed inside the owner's sandbox container
# (gcc:latest, which ships python3; --network=none, pids/memory capped). Unlike
# the python/java runners it does NO parsing/structure/injection; for C those
# happen on the SERVER via tree-sitter (see c-analysis.ts). This runner only:
#   1. compiles the pristine user code once (gate 2: gcc surfaces semantic
#      errors tree-sitter recovers from: undeclared identifier, type mismatch);
#   2. per case, compiles + runs the already-injected userSrc and solutionSrc
#      with the case's stdin (timing only the program's own code, see
#      TIMER_SRC), memoizing compiled binaries by source string so
#      identical stdin-only sources compile once and run N times. Each case's
#      result is streamed as a JSON line, and the next case starts only on the
#      server's go-ahead (it stops the run at the first failing case).
# Compiled binaries live under /work (the exec tmpfs mount; /tmp is noexec).
# Expected outputs never enter this container: the server compares the two
# stdouts on its side.
import hashlib
import json
import os
import subprocess
import sys

# Room for a slow but working program on the load test.
CASE_TIMEOUT = 10
# A load test's output can run to tens of KB (a sorted list of 10^4 numbers).
OUTPUT_CAP = 1024 * 1024
COMPILE_TIMEOUT = 20
# Overridable so the runner can be exercised outside a container (unit tests).
WORK = os.environ.get("JUDGE_WORK_DIR", "/work")

# Linked into every judged program. A constructor that runs before the
# program's own (priority 101) starts the clock, and the atexit handler it
# registers first, so it runs last, stops it, so process startup is left out
# and the program's atexit handlers count. It is CPU time, not wall time: the
# container's CPU cap pauses a process for tens of ms at random, and those
# pauses aren't the code's. The time goes out on the pipe named by _JT_FD,
# never on stdout. A crash or _exit reports no time.
TIMER_SRC = r'''
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

static struct timespec cyberstars_judge_t0;
static int cyberstars_judge_fd = -1;

static void cyberstars_judge_report(void) {
    struct timespec t1;
    char buf[64];
    clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &t1);
    double ms = (t1.tv_sec - cyberstars_judge_t0.tv_sec) * 1e3
        + (t1.tv_nsec - cyberstars_judge_t0.tv_nsec) / 1e6;
    int n = snprintf(buf, sizeof buf, "%.6f", ms);
    if (cyberstars_judge_fd >= 0 && n > 0) {
        ssize_t written = write(cyberstars_judge_fd, buf, (size_t)n);
        (void)written;
    }
}

__attribute__((constructor(101))) static void cyberstars_judge_start(void) {
    const char *fd = getenv("_JT_FD");
    if (fd) {
        cyberstars_judge_fd = atoi(fd);
        unsetenv("_JT_FD");
    }
    atexit(cyberstars_judge_report);
    clock_gettime(CLOCK_PROCESS_CPUTIME_ID, &cyberstars_judge_t0);
}
'''

# source string -> (binary_path or None, sanitized_stderr)
_compile_cache = {}
_timer_object = []


def timer_object():
    # Compiled once per run, then linked into every program.
    if not _timer_object:
        c_path = os.path.join(WORK, "_timer.c")
        obj_path = os.path.join(WORK, "_timer.o")
        with open(c_path, "w", encoding="utf-8") as f:
            f.write(TIMER_SRC)
        subprocess.run(
            ["gcc", "-c", c_path, "-o", obj_path],
            stdin=subprocess.DEVNULL,
            capture_output=True,
            timeout=COMPILE_TIMEOUT,
            check=True,
        )
        _timer_object.append(obj_path)
    return _timer_object[0]


def compile_source(src):
    if src in _compile_cache:
        return _compile_cache[src]
    digest = hashlib.md5(src.encode("utf-8")).hexdigest()
    c_path = os.path.join(WORK, "_%s.c" % digest)
    bin_path = os.path.join(WORK, "_%s.out" % digest)
    with open(c_path, "w", encoding="utf-8") as f:
        f.write(src)
    try:
        proc = subprocess.run(
            ["gcc", "-Wall", c_path, timer_object(), "-o", bin_path, "-lm", "-lpthread"],
            # stdin is the control channel with the server; gcc gets none.
            stdin=subprocess.DEVNULL,
            capture_output=True,
            text=True,
            errors="replace",
            timeout=COMPILE_TIMEOUT,
        )
        ok = proc.returncode == 0
        # Don't leak the temp filename in the reported compiler error.
        stderr = proc.stderr.replace(c_path, "program.c")[:OUTPUT_CAP]
    except subprocess.TimeoutExpired:
        ok, stderr = False, "compilation timed out"
    result = (bin_path if ok else None, stderr)
    _compile_cache[src] = result
    return result


def as_text(raw):
    # Programs are captured as bytes and decoded leniently: a student program
    # that prints invalid UTF-8 (a raw byte, an overflowed char) gets graded on
    # its output with U+FFFD in place of the bad bytes, never crashes the runner.
    return (raw or b"").decode("utf-8", "replace")


def code_ms(read_fd):
    # What the program's timer wrote, or None when it never reported. Read
    # without blocking: a process the program forked may still hold the pipe.
    os.set_blocking(read_fd, False)
    try:
        return float(os.read(read_fd, 64).decode("ascii"))
    except (BlockingIOError, ValueError):
        return None
    finally:
        os.close(read_fd)


def run_binary(bin_path, stdin=None):
    read_fd, write_fd = os.pipe()
    proc = subprocess.Popen(
        [bin_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        pass_fds=(write_fd,),
        env={**os.environ, "_JT_FD": str(write_fd)},
    )
    # Only the child holds the write end now, so the read below ends at its exit.
    os.close(write_fd)
    try:
        stdout, stderr = proc.communicate((stdin or "").encode("utf-8"), timeout=CASE_TIMEOUT)
        timed_out = False
    except subprocess.TimeoutExpired:
        proc.kill()
        stdout, stderr = proc.communicate()
        timed_out = True
    result = {
        "stdout": as_text(stdout)[:OUTPUT_CAP],
        "stderr": as_text(stderr)[:OUTPUT_CAP],
        "exit": -1 if timed_out else proc.returncode,
        "timedOut": timed_out,
    }
    ms = code_ms(read_fd)
    if ms is not None and not timed_out:
        result["ms"] = ms
    return result


def emit(obj):
    print(json.dumps(obj), flush=True)


def proceed():
    # Lockstep with the server: after each case line it compares the outputs
    # and answers "next" or "stop" (stop at the first failing case). EOF (the
    # server went away) also stops.
    return sys.stdin.readline().strip() == "next"


def main():
    # Output protocol, one JSON object per line: a header {syntaxError}, then
    # one line per case, each followed by a reply on stdin (see proceed). A
    # compile error of the pristine code ends the run after the header.
    with open(sys.argv[1]) as f:
        payload = json.load(f)

    pristine_bin, pristine_err = compile_source(payload["pristineUser"])
    if pristine_bin is None:
        emit({"syntaxError": pristine_err.strip() or "compilation failed"})
        return
    emit({"syntaxError": None})

    for case in payload["cases"]:
        stdin = case.get("stdin")
        user_bin, _ = compile_source(case["userSrc"])
        solution_bin = compile_source(case["solutionSrc"])[0]
        # The pristine user code already compiled cleanly, so a post-injection
        # compile failure is a spec bug (injection type/decl mismatch), not the
        # student's; surfaced by the server as a 500, same as java's injectError.
        if user_bin is None or solution_bin is None:
            emit({"injectError": True})
            break
        user_run = run_binary(user_bin, stdin)
        emit({"user": user_run, "solution": run_binary(solution_bin, stdin)})
        # A hung program would burn CASE_TIMEOUT on every remaining case too.
        if user_run["timedOut"] or not proceed():
            break


main()
