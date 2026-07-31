A parent and a child want to confirm the link between them: each one prints the PID of the other. The child gets the parent's PID via **getppid()**, while the parent receives the child's PID directly from **fork()**'s return value.

Fork returns:

- `0` to the child
- the child's PID to the parent

The child prints first, and the parent waits with **wait(NULL)** before printing its own line — that's how we guarantee the order.

### Input

- No input.

### Output

- Line 1 (from the child): `Child: my parent is X`
- Line 2 (from the parent): `Parent: my child is Y`

The child always prints first, because the parent waits for the child to finish.

### Example

The PIDs differ on each run; what matters is the relationship between them.

```
Output:
Child: my parent is 42
Parent: my child is 43
```

Use **fork()**, **getpid()**, **getppid()** from `unistd.h` and **wait(NULL)** from `sys/wait.h`.
