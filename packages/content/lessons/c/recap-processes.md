fork, exec, exit status and many children running at once, in one program

---

## Mission: The Morning Checks

Before the first shift, the computing center runs a list of quick checks. Each check is a small program that prints nothing: it only answers with its exit status, 0 when all is well. The checks don't depend on each other, so they all run at the same time

The checks use the program **test**. `test 5 -gt 3` exits with 0 because 5 is greater than 3. `test -d /tmp` exits with 0 if /tmp is a directory, `test -f name` if name is a regular file. When the answer is no, test exits with 1

1. Read checks, one per line, until the input ends. Each line is a program and its arguments, separated by spaces
2. Start all the checks first, each in its own child, with execvp. If exec fails, the child exits with 127 and prints nothing
3. Then collect all the children with wait and match each PID to its check
4. Print one line per check, in the order of the input: `passed` for exit status 0, `missing` for 127, and `failed` for anything else. Then print how many passed, as in the example

Call fflush(stdout) before every fork. There are from 1 to 10 checks, each with at most 8 words and at most 100 characters

**Example**

Input

```text
test 5 -gt 3
test -f ghost.txt
nosuchcheck
test -d /tmp
```

Output

```text
1: passed
2: failed
3: missing
4: passed
Passed: 2 of 4
```
