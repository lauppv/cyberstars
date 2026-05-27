# Medium · Stack Implementation

Implement a **Stack** class using an `ArrayList` as the internal storage. The stack should support `push`, `pop`, and `peek` operations.

Process commands from stdin and print results for `pop` and `peek`. If `pop` or `peek` is called on an empty stack, print `Empty`.

### Input

- Line 1: number of commands N
- Next N lines: one of:
  - `push X` — push integer X onto the stack
  - `pop` — remove and print the top element
  - `peek` — print the top element without removing it

### Output

- For each `pop`: the removed value, or `Empty`
- For each `peek`: the top value, or `Empty`

### Examples

```
Input:
6
push 10
push 20
peek
pop
pop
pop

Output:
20
20
10
Empty
```

```
Input:
3
push 5
push 15
peek

Output:
15
```

### Hints

- Use `ArrayList<Integer>` to store elements.
- Push adds to the end of the list, pop removes from the end.
- `list.get(list.size() - 1)` gives you the top element.
- `list.remove(list.size() - 1)` removes and returns the top.
- Always check `isEmpty()` before pop/peek.
