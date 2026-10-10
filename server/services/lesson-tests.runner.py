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


def function_defs(tree):
    return [n for n in ast.walk(tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]


def has_function(tree, name=None):
    return any(name is None or node.name == name for node in function_defs(tree))


def called_function(call):
    # The name of the student's own function a call reaches: f(...), or a
    # method through self./cls. (s.count(...) is the str method, not a
    # function named count).
    func = call.func
    if isinstance(func, ast.Name):
        return func.id
    if (
        isinstance(func, ast.Attribute)
        and isinstance(func.value, ast.Name)
        and func.value.id in ("self", "cls")
    ):
        return func.attr
    return None


def calls_itself(fn):
    return any(
        isinstance(node, ast.Call) and called_function(node) == fn.name for node in ast.walk(fn)
    )


def has_recursion(tree):
    return any(calls_itself(fn) for fn in function_defs(tree))


# A typed rule asks for that statement itself: a comprehension is no for
# statement, and Python has no do-while.
LOOP_NODES = {
    "for": (ast.For, ast.AsyncFor),
    "while": (ast.While,),
    "do_while": (),
    "comprehension": (ast.comprehension,),
}


def has_loop(tree, loop_type=None):
    nodes = LOOP_NODES.get(loop_type, ()) if loop_type else (ast.For, ast.While, ast.comprehension)
    return any(isinstance(node, nodes) for node in ast.walk(tree))


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


LOOP_STATEMENTS = (ast.For, ast.AsyncFor, ast.While)

# Spec spelling of each operator: the symbol for the ones that have one,
# the keyword for and / or / not / in / is.
OPERATORS = {
    ast.And: "and", ast.Or: "or", ast.Not: "not", ast.Add: "+", ast.Sub: "-",
    ast.Mult: "*", ast.Div: "/", ast.FloorDiv: "//", ast.Mod: "%", ast.Pow: "**",
    ast.BitAnd: "&", ast.BitOr: "|", ast.BitXor: "^", ast.Invert: "~",
    ast.LShift: "<<", ast.RShift: ">>", ast.Eq: "==", ast.NotEq: "!=", ast.Lt: "<",
    ast.LtE: "<=", ast.Gt: ">", ast.GtE: ">=", ast.In: "in", ast.NotIn: "not in",
    ast.Is: "is", ast.IsNot: "is not",
}


def operators_used(tree):
    found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.BoolOp):
            found.add(OPERATORS[type(node.op)])
        elif isinstance(node, (ast.BinOp, ast.UnaryOp, ast.AugAssign)):
            found.add(OPERATORS.get(type(node.op)))
        elif isinstance(node, ast.Compare):
            found.update(OPERATORS[type(op)] for op in node.ops)
    return found


def has_nested_loop(tree):
    for outer in ast.walk(tree):
        if isinstance(outer, LOOP_STATEMENTS):
            body = outer.body + outer.orelse
            if any(isinstance(n, LOOP_STATEMENTS) for stmt in body for n in ast.walk(stmt)):
                return True
    return False


def class_names(tree):
    return {n.name for n in ast.walk(tree) if isinstance(n, ast.ClassDef)}


def has_object(tree):
    # A class of the student's own, instantiated: Dog(...) where class Dog exists.
    own = class_names(tree)
    return any(
        isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in own
        for n in ast.walk(tree)
    )


def has_return_value(tree):
    return any(
        isinstance(n, ast.Return) and n.value is not None
        for fn in function_defs(tree)
        for n in ast.walk(fn)
    )


def has_default_param(tree):
    return any(
        fn.args.defaults or any(d is not None for d in fn.args.kw_defaults)
        for fn in function_defs(tree)
    )


TRY_NODES = tuple(t for t in (ast.Try, getattr(ast, "TryStar", None)) if t)
STATEMENT_KINDS = {
    "if": (ast.If,),
    "switch": (getattr(ast, "Match", ()),),
    "break": (ast.Break,),
    "continue": (ast.Continue,),
    "try": TRY_NODES,
    "slice": (ast.Slice,),
}


def rule_holds(tree, source, rule):
    kind = rule.get("kind")
    if kind == "call":
        return has_call(tree, rule["name"])
    if kind == "variable":
        return has_variable(tree, rule["name"])
    if kind == "function":
        return has_function(tree, rule.get("name"))
    if kind == "loop":
        return has_loop(tree, rule.get("type"))
    if kind == "recursion":
        return has_recursion(tree)
    if kind == "fstring":
        return has_fstring(tree)
    if kind == "int_literal":
        return bool(int_literals(tree, set(rule.get("values", []))))
    if kind == "comment":
        return has_comment(source, rule.get("contains"))
    if kind == "string_expr":
        return has_string_expr(tree)
    if kind in STATEMENT_KINDS:
        nodes = tuple(t for t in STATEMENT_KINDS[kind] if isinstance(t, type))
        return any(isinstance(n, nodes) for n in ast.walk(tree))
    if kind == "nested_loop":
        return has_nested_loop(tree)
    if kind == "operator":
        return rule.get("name") in operators_used(tree)
    if kind == "class":
        names = class_names(tree)
        return rule["name"] in names if rule.get("name") else bool(names)
    if kind == "object":
        return has_object(tree)
    if kind == "return":
        return has_return_value(tree)
    if kind == "default_param":
        return has_default_param(tree)
    return True


def scoped_holds(tree, source, rule):
    # A rule with "in" looks only inside that function (forbid [::-1] in
    # reverse_text while the rest of the program may slice). No such
    # function: a require fails and a forbid has nothing to fire on.
    scope = rule.get("in")
    if not scope:
        return rule_holds(tree, source, rule)
    fns = [fn for fn in function_defs(tree) if fn.name == scope]
    return any(rule_holds(fn, source, rule) for fn in fns)


def check_structure(tree, source, structure):
    failures = []
    for rule in structure.get("requires", []):
        if not scoped_holds(tree, source, rule):
            failures.append({"type": "require", "rule": rule})
    for rule in structure.get("forbids", []):
        if scoped_holds(tree, source, rule):
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


def scoped_assigns(node, params=frozenset(), top_level=True):
    # Yields (single-name Assign, parameters of its enclosing functions, whether
    # it sits outside every function).
    for child in ast.iter_child_nodes(node):
        if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)):
            a = child.args
            names = {arg.arg for arg in a.posonlyargs + a.args + a.kwonlyargs}
            names |= {arg.arg for arg in (a.vararg, a.kwarg) if arg}
            yield from scoped_assigns(child, params | names, False)
            continue
        if (
            isinstance(child, ast.Assign)
            and len(child.targets) == 1
            and isinstance(child.targets[0], ast.Name)
        ):
            yield child, params, top_level
        yield from scoped_assigns(child, params, top_level)


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
    # Two exceptions keep a helper's locals out of it: an assignment to one of
    # its enclosing functions' parameters is never the input, and once the
    # variable is assigned outside every function, only those assignments count.
    if not values:
        return code
    tree = ast.parse(code)
    remaining = {
        name: list(v) if isinstance(v, list) else [v] for name, v in values.items()
    }
    consumed = set()
    assigns = [
        (node, top_level)
        for node, params, top_level in scoped_assigns(tree)
        if node.targets[0].id not in params
    ]
    at_top = {node.targets[0].id for node, top_level in assigns if top_level}
    assigns = [
        node for node, top_level in assigns if top_level or node.targets[0].id not in at_top
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
# time goes out on the pipe named by _JT_FD, never on stdout, and only from the
# program's own process (a forked child inherits the hook). A program that
# ends through os._exit or a kill reports no time.
PREAMBLE = (
    "import builtins as _b, atexit as _ae, os as _os, time as _tm\n"
    "_oi = _b.input; _b.input = lambda *a, **k: _oi()\n"
    "_ae.register(lambda _s=_tm.process_time(), _fd=int(_os.environ.pop('_JT_FD')), "
    "_p=_os.getpid(): _os.getpid() == _p and _os.write(_fd, b'%.6f' % ((_tm.process_time() - _s) * 1000)))\n"
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
