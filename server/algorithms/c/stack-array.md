# Medium · Stack Using Array

Implement a **stack** data structure using an array. Read a sequence of commands and process them:

- **push X** — push integer X onto the stack
- **pop** — remove and print the top element, or print `Empty` if the stack is empty
- **peek** — print the top element without removing it, or print `Empty` if the stack is empty

### Input
- First line: an integer `M` (1 ≤ M ≤ 100), the number of commands
- Next `M` lines: one command per line (`push X`, `pop`, or `peek`)

### Output
For each `pop` or `peek` command, print one line: the value or `Empty`.

### Examples

```
Input:
5
push 10
push 20
peek
pop
pop
Output:
20
20
10
```

```
Input:
3
pop
push 5
peek
Output:
Empty
5
```

### Hints
- Use an array of fixed size (e.g., 100) and a `top` variable initialized to `-1`.
- `push`: increment `top`, then set `arr[top] = X`.
- `pop`: if `top >= 0`, print `arr[top]` and decrement `top`; otherwise print `Empty`.
- `peek`: if `top >= 0`, print `arr[top]`; otherwise print `Empty`.
- Use `strcmp` to compare command strings — remember to `#include <string.h>`.
