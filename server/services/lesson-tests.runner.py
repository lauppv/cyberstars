# Trusted judge runner, executed inside the owner's sandbox container
# (python:3.10-slim, --network=none, pids/memory capped). Reads a payload JSON
# ({userCode, solutionCode, structure, cases}), checks the user code's
# structure with the ast module, injects each case's values into the lesson's
# input variables (in BOTH the user code and the reference solution), runs the
# two programs per case, and prints a single JSON verdict to stdout.
# Expected outputs never enter this container: the server compares the two
# stdouts on its side.
import ast
import json
import subprocess
import sys

CASE_TIMEOUT = 5
OUTPUT_CAP = 64 * 1024


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


def rule_holds(tree, rule):
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
    return True


def check_structure(tree, structure):
    failures = []
    for rule in structure.get("requires", []):
        if not rule_holds(tree, rule):
            failures.append({"type": "require", "rule": rule})
    for rule in structure.get("forbids", []):
        if rule_holds(tree, rule):
            failures.append({"type": "forbid", "rule": rule})
    return failures


def inject_values(code, values):
    # Replace successive module-level assignments of each input variable with
    # the test values: a scalar targets the first assignment, a list feeds one
    # value per assignment in order (reassignment lessons). A variable that is
    # never assigned gets its first value re-inserted at the top so the program
    # still runs (a hardcoded/incomplete program then fails on output anyway).
    if not values:
        return code
    tree = ast.parse(code)
    remaining = {
        name: list(v) if isinstance(v, list) else [v] for name, v in values.items()
    }
    consumed = set()
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1:
            target = node.targets[0]
            if isinstance(target, ast.Name) and remaining.get(target.id):
                node.value = ast.Constant(remaining[target.id].pop(0))
                consumed.add(target.id)
    prelude = [
        ast.Assign(targets=[ast.Name(id=name, ctx=ast.Store())], value=ast.Constant(vals[0]))
        for name, vals in remaining.items()
        if name not in consumed and vals
    ]
    tree.body = prelude + tree.body
    return ast.unparse(ast.fix_missing_locations(tree))


def run_program(code):
    path = "/tmp/_judged.py"
    with open(path, "w") as f:
        f.write(code)
    try:
        proc = subprocess.run(
            [sys.executable, "-u", path],
            capture_output=True,
            text=True,
            timeout=CASE_TIMEOUT,
            stdin=subprocess.DEVNULL,
        )
        return {
            "stdout": proc.stdout[:OUTPUT_CAP],
            "stderr": proc.stderr[:OUTPUT_CAP],
            "exit": proc.returncode,
            "timedOut": False,
        }
    except subprocess.TimeoutExpired as e:
        # TimeoutExpired carries bytes even when text=True
        def as_text(raw):
            if raw is None:
                return ""
            return raw.decode("utf-8", "replace") if isinstance(raw, bytes) else raw

        return {
            "stdout": as_text(e.stdout)[:OUTPUT_CAP],
            "stderr": as_text(e.stderr)[:OUTPUT_CAP],
            "exit": -1,
            "timedOut": True,
        }


def main():
    with open(sys.argv[1]) as f:
        payload = json.load(f)

    result = {"syntaxError": None, "structureFailures": [], "cases": []}

    try:
        user_tree = ast.parse(payload["userCode"])
    except SyntaxError as e:
        result["syntaxError"] = "line %s: %s" % (e.lineno, e.msg)
        print(json.dumps(result))
        return

    result["structureFailures"] = check_structure(user_tree, payload.get("structure", {}))

    for case in payload["cases"]:
        inject = case.get("inject") or {}
        try:
            user_src = inject_values(payload["userCode"], inject)
            solution_src = inject_values(payload["solutionCode"], inject)
        except SyntaxError:
            # solution is trusted; user code already parsed — should not happen
            result["cases"].append({"injectError": True})
            continue
        user_run = run_program(user_src)
        result["cases"].append({"user": user_run, "solution": run_program(solution_src)})
        # A hung program would burn 5s on every remaining case too — stop here.
        if user_run["timedOut"]:
            break

    print(json.dumps(result))


main()
