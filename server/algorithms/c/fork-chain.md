A "grandparent" process forks to create a "parent" process. That parent, in turn, forks to create a "grandchild". Each generation prints its level and its own PID, but printing goes **from grandchild up to grandparent**: every parent uses **wait(NULL)** to let its own child finish before printing.

The structure looks like **fork inside fork**: after the first `fork()`, the child calls `fork()` again. Watch the `return 0` placement — if it's missing, the "wrong" processes continue running the code below.

### Input

- No input.

### Output

- 3 lines, in reverse generation order:
  - `Level 2 (grandchild): PID X`
  - `Level 1 (parent): PID Y`
  - `Level 0 (grandparent): PID Z`

PIDs differ on every run, but the order of the lines is always grandchild → parent → grandparent.

### Example

```
Output:
Level 2 (grandchild): PID 45
Level 1 (parent): PID 44
Level 0 (grandparent): PID 43
```

Use **fork()**, **getpid()** and **wait(NULL)**.
