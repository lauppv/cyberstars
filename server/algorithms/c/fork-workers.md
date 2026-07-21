# Medium · Multiple Children

A computing centre receives an execution order specifying how many child processes to launch. Each child reports that it is ready, and the parent confirms at the end that all of them are done.

Each iteration of the loop calls **fork()**. In the child, we print the message and **exit immediately** — if we don't exit, the child keeps running the loop and forks its own children, exponentially.

### Input

- Line 1: integer `N` (1 ≤ N ≤ 5)

### Output

- N lines of the form `Child K ready` where K is the child's index (1 through N). The order of these lines may vary — the processes run concurrently.
- Last line: `All children finished`.

The final message must always come last, because the parent uses **wait(NULL)** to wait for all N children before printing it.

### Examples

```
Input:
3
Output:
Child 1 ready
Child 2 ready
Child 3 ready
All children finished
```

The order of the N `Child K ready` lines may vary (for example, `Child 2 ready` may appear first); the last line always stays last.

Use **fork()** in a loop and **wait(NULL)** N times to wait for all children.
