# Trusted judge runner, executed inside the owner's sandbox container
# (python:3.10-slim, --network=none, pids/memory capped). Reads a payload JSON
# ({userCode, solutionCode, structure, cases}), checks the user code's
# structure with the ast module, injects each case's values into the lesson's
# input variables (in BOTH the user code and the reference solution) and/or
# feeds the case's stdin to both, runs the two programs per case (timing only
# the program's own code, see PREAMBLE), and streams the verdict to stdout as
# JSON lines, one
# case at a time, waiting for the server's go-ahead between cases.
# Expected outputs never enter this container: the server compares the two
# stdouts on its side.
import ast
import io
import json
import os
import subprocess
import sys
import tokenize

# Room for a slow but working program on the load test.
CASE_TIMEOUT = 10
# A load test's output can run to tens of KB (a sorted list of 10^4 numbers).
OUTPUT_CAP = 1024 * 1024


def has_call(tree, name):
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            func = node.func
            if isinstance(func, ast.Name) and func.id == name:
                return True
            if isinstance(func, ast.Attribute) and func.attr == name:
                return True
    return False


def assigned_names(node):
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name):
                yield target.id
    elif isinstance(node, (ast.AugAssign, ast.AnnAssign)):
        if isinstance(node.target, ast.Name):
            yield node.target.id


def has_variable(tree, name):
    for node in ast.walk(tree):
        if name in assigned_names(node):
            return True
    return False


def has_function(tree, name):
    return any(
        isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == name
        for node in ast.walk(tree)
    )


def has_loop(tree):
    return any(
        isinstance(node, (ast.For, ast.While, ast.comprehension)) for node in ast.walk(tree)
    )


def has_fstring(tree):
    return any(isinstance(node, ast.JoinedStr) for node in ast.walk(tree))


def int_literals(tree, values):
    found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Constant) and type(node.value) is int and node.value in values:
            found.add(node.value)
    return found


def has_comment(source, contains):
    # Whitespace-insensitive match so `# print( wind_speed )` still contains
    # `wind_speed`; students shouldn't fail on spacing inside the comment.
    needle = "".join((contains or "").split())
    try:
        for tok in tokenize.generate_tokens(io.StringIO(source).readline):
            if tok.type == tokenize.COMMENT:
                if not needle or needle in "".join(tok.string.split()):
                    return True
    except (tokenize.TokenError, IndentationError):
        pass
    return False


def has_string_expr(tree):
    # A bare string as a statement: the "floating string" that students use to
    # counterfeit a comment (wrapping a line in quotes, or ''' ''' blocks).
    for node in ast.walk(tree):
        if isinstance(node, ast.Expr):
            if isinstance(node.value, ast.JoinedStr):
                return True
            if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                return True
    return False


def rule_holds(tree, source, rule):
    kind = rule.get("kind")
    if kind == "call":
        return has_call(tree, rule["name"])
    if kind == "variable":
        return has_variable(tree, rule["name"])
    if kind == "function":
        return has_function(tree, rule["name"])
    if kind == "loop":
        return has_loop(tree)
    if kind == "fstring":
        return has_fstring(tree)
    if kind == "int_literal":
        return bool(int_literals(tree, set(rule.get("values", []))))
    if kind == "comment":
        return has_comment(source, rule.get("contains"))
    if kind == "string_expr":
        return has_string_expr(tree)
    return True


def check_structure(tree, source, structure):
    failures = []
    for rule in structure.get("requires", []):
        if not rule_holds(tree, source, rule):
            failures.append({"type": "require", "rule": rule})
    for rule in structure.get("forbids", []):
        if rule_holds(tree, source, rule):
            failures.append({"type": "forbid", "rule": rule})
    return failures


def to_ast_value(v):
    # A bare scalar becomes a Constant; {"$list": [...]} becomes a whole list
    # value (so a variable holding a list can be injected; a bare JSON array is
    # already taken by per-occurrence injection for reassignment lessons);
    # {"$dict": {...}} becomes a whole dict value (insertion order preserved by
    # the JSON parser, which matters for lessons that loop over keys/values).
    if isinstance(v, dict) and "$list" in v:
        return ast.List(elts=[to_ast_value(e) for e in v["$list"]], ctx=ast.Load())
    if isinstance(v, dict) and "$dict" in v:
        pairs = v["$dict"]
        return ast.Dict(
            keys=[to_ast_value(k) for k in pairs],
            values=[to_ast_value(val) for val in pairs.values()],
        )
    return ast.Constant(v)


def inject_values(code, values):
    # Replace successive assignments of each input variable with the test
    # values: a scalar targets the first assignment, a list feeds one value per
    # assignment in order (reassignment lessons). A variable that is never
    # assigned gets its first value re-inserted at the top so the program still
    # runs (a hardcoded/incomplete program then fails on output anyway).
    #
    # Assignments are collected tree-wide (not just module level) in source
    # order, so a solution that wraps its logic in a function/`main()` or an
    # `if __name__ == "__main__":` block still gets its input variables injected.
    # The structure check (`has_variable`) already looks tree-wide; injection has
    # to match, or an honestly-scoped solution would diverge from the oracle.
    if not values:
        return code
    tree = ast.parse(code)
    remaining = {
        name: list(v) if isinstance(v, list) else [v] for name, v in values.items()
    }
    consumed = set()
    assigns = [
        node
        for node in ast.walk(tree)
        if isinstance(node, ast.Assign)
        and len(node.targets) == 1
        and isinstance(node.targets[0], ast.Name)
    ]
    assigns.sort(key=lambda n: (getattr(n, "lineno", 0), getattr(n, "col_offset", 0)))
    for node in assigns:
        name = node.targets[0].id
        if remaining.get(name):
            node.value = to_ast_value(remaining[name].pop(0))
            consumed.add(name)
    prelude = [
        ast.Assign(targets=[ast.Name(id=name, ctx=ast.Store())], value=to_ast_value(vals[0]))
        for name, vals in remaining.items()
        if name not in consumed and vals
    ]
    tree.body = prelude + tree.body
    return ast.unparse(ast.fix_missing_locations(tree))


# Neutralize input() prompts: lessons teach input("prompt"), but a prompt writes
# to stdout and would pollute the compared output. Overriding input to ignore
# its prompt argument (applied to BOTH user and solution) makes input("...") and
# bare input() produce identical output, so students aren't graded on prompts.
# Prepended to every judged program, kept to three lines so tracebacks stay as
# they were. input() drops its prompt (the prompt isn't part of the expected
# output), and an atexit hook reports how long the program's own code ran,
# measured from just before its first line, so interpreter startup is left
# out. It is CPU time, not wall time: the container's CPU cap pauses a
# process for tens of ms at random, and those pauses aren't the code's. The
# time goes out on the pipe named by _JT_FD, never on stdout. A program that
# ends through os._exit or a kill reports no time.
PREAMBLE = (
    "import builtins as _b, atexit as _ae, os as _os, time as _tm\n"
    "_oi = _b.input; _b.input = lambda *a, **k: _oi()\n"
    "_ae.register(lambda _s=_tm.process_time(), _fd=int(_os.environ.pop('_JT_FD')): "
    "_os.write(_fd, b'%.6f' % ((_tm.process_time() - _s) * 1000)))\n"
)


def as_text(raw):
    # Programs are captured as bytes and decoded leniently: a student program
    # that prints invalid UTF-8 (a raw byte, an overflowed char) gets graded on
    # its output with U+FFFD in place of the bad bytes, never crashes the runner.
    return (raw or b"").decode("utf-8", "replace")


def code_ms(read_fd):
    # What the program's atexit hook wrote, or None when it never ran. Read
    # without blocking: a process the program forked may still hold the pipe.
    os.set_blocking(read_fd, False)
    try:
        return float(os.read(read_fd, 64).decode("ascii"))
    except (BlockingIOError, ValueError):
        return None
    finally:
        os.close(read_fd)


def run_program(code, stdin=None):
    path = "/tmp/_judged.py"
    with open(path, "w", encoding="utf-8") as f:
        f.write(PREAMBLE + code)
    read_fd, write_fd = os.pipe()
    proc = subprocess.Popen(
        [sys.executable, "-u", path],
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
    # Output protocol, one JSON object per line: a header
    # {syntaxError, structureFailures}, then one line per case, each followed
    # by a reply on stdin (see proceed). A syntax error ends the run after the
    # header.
    with open(sys.argv[1]) as f:
        payload = json.load(f)

    try:
        user_tree = ast.parse(payload["userCode"])
    except SyntaxError as e:
        emit({"syntaxError": "line %s: %s" % (e.lineno, e.msg), "structureFailures": []})
        return

    emit(
        {
            "syntaxError": None,
            "structureFailures": check_structure(
                user_tree, payload["userCode"], payload.get("structure", {})
            ),
        }
    )

    for case in payload["cases"]:
        inject = case.get("inject") or {}
        stdin = case.get("stdin")
        # skipSolution: the server already holds this case's reference output
        # (cached from an earlier run), so only the student's program runs.
        skip_solution = case.get("skipSolution", False)
        try:
            user_src = inject_values(payload["userCode"], inject)
            solution_src = None if skip_solution else inject_values(payload["solutionCode"], inject)
        except SyntaxError:
            # solution is trusted; user code already parsed, should not happen.
            # The server fails the whole run on it, so there is nothing after.
            emit({"injectError": True})
            break
        user_run = run_program(user_src, stdin)
        if skip_solution:
            emit({"user": user_run})
        else:
            emit({"user": user_run, "solution": run_program(solution_src, stdin)})
        # A hung program would burn 5s on every remaining case too, so stop here.
        if user_run["timedOut"] or not proceed():
            break


main()
