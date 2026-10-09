# Thin C judge runner, executed inside the owner's sandbox container
# (gcc:latest, which ships python3; --network=none, pids/memory capped). Unlike
# the python/java runners it does NO parsing/structure/injection; for C those
# happen on the SERVER via tree-sitter (see c-analysis.ts). This runner only:
#   1. compiles the pristine user code once (gate 2: gcc surfaces semantic
#      errors tree-sitter recovers from: undeclared identifier, type mismatch);
#   2. per case, compiles + runs the already-injected userSrc and solutionSrc
#      with the case's stdin, memoizing compiled binaries by source string so
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
import time

CASE_TIMEOUT = 5
OUTPUT_CAP = 64 * 1024
COMPILE_TIMEOUT = 20
WORK = "/work"

# source string -> (binary_path or None, sanitized_stderr)
_compile_cache = {}


def compile_source(src):
    if src in _compile_cache:
        return _compile_cache[src]
    digest = hashlib.md5(src.encode("utf-8")).hexdigest()
    c_path = os.path.join(WORK, "_%s.c" % digest)
    bin_path = os.path.join(WORK, "_%s.out" % digest)
    with open(c_path, "w") as f:
        f.write(src)
    try:
        proc = subprocess.run(
            ["gcc", "-Wall", c_path, "-o", bin_path, "-lm", "-lpthread"],
            # stdin is the control channel with the server; gcc gets none.
            stdin=subprocess.DEVNULL,
            capture_output=True,
            text=True,
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


def elapsed_ms(started):
    return round((time.perf_counter() - started) * 1000, 3)


def run_binary(bin_path, stdin=None):
    # Wall time of the run alone; the compile above is not part of it.
    started = time.perf_counter()
    try:
        proc = subprocess.run(
            [bin_path],
            capture_output=True,
            text=True,
            timeout=CASE_TIMEOUT,
            input=stdin if stdin is not None else "",
        )
        return {
            "stdout": proc.stdout[:OUTPUT_CAP],
            "stderr": proc.stderr[:OUTPUT_CAP],
            "exit": proc.returncode,
            "timedOut": False,
            "ms": elapsed_ms(started),
        }
    except subprocess.TimeoutExpired as e:
        def as_text(raw):
            if raw is None:
                return ""
            return raw.decode("utf-8", "replace") if isinstance(raw, bytes) else raw

        return {
            "stdout": as_text(e.stdout)[:OUTPUT_CAP],
            "stderr": as_text(e.stderr)[:OUTPUT_CAP],
            "exit": -1,
            "timedOut": True,
            "ms": elapsed_ms(started),
        }


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
        # skipSolution: the server already holds this case's reference output
        # (cached from an earlier run) and sends no solutionSrc for it.
        skip_solution = case.get("skipSolution", False)
        user_bin, _ = compile_source(case["userSrc"])
        solution_bin = None if skip_solution else compile_source(case["solutionSrc"])[0]
        # The pristine user code already compiled cleanly, so a post-injection
        # compile failure is a spec bug (injection type/decl mismatch), not the
        # student's; surfaced by the server as a 500, same as java's injectError.
        if user_bin is None or (solution_bin is None and not skip_solution):
            emit({"injectError": True})
            break
        user_run = run_binary(user_bin, stdin)
        if skip_solution:
            emit({"user": user_run})
        else:
            emit({"user": user_run, "solution": run_binary(solution_bin, stdin)})
        # A hung program would burn CASE_TIMEOUT on every remaining case too.
        if user_run["timedOut"] or not proceed():
            break


main()
