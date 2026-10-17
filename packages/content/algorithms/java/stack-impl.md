Implement a **Stack** class using an `ArrayList` as the internal storage. The stack should support `push`, `pop`, and `peek` operations.

Process commands from stdin and print results for `pop` and `peek`. If `pop` or `peek` is called on an empty stack, print `Empty`.

### Input

- Line 1: number of commands N (1 <= N <= 2·10^4)
- For each command:
  - Line 1: command type (`push`, `pop`, or `peek`)
  - Only for `push`, line 2: the integer X (any `int` value)

Behavior:

- `push X`: push X onto the stack
- `pop`: remove and print the top element
- `peek`: print the top element without removing it

### Output

- For each `pop`: the removed value, or `Empty`
- For each `peek`: the top value, or `Empty`

### Examples

```
Input:
6
push
10
push
20
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

```visual
{
  "type": "stack",
  "ends": true,
  "caption": "A stack: the last value pushed is the first to come off, like plates on a pile. pop and peek both work on the top.",
  "steps": [
    {"push": [{"id": "v1", "text": 10}], "focus": ["v1"], "caption": "push 10: 10 goes on the empty stack"},
    {"push": [{"id": "v2", "text": 20}], "focus": ["v2"], "caption": "push 20: 20 goes on top of 10"},
    {"ask": "What does peek print?", "focus": ["v2"], "caption": "20: peek shows the top and leaves it there"},
    {"ask": "What does pop print?", "pop": 1, "focus": ["v2"], "caption": "20: pop takes the top off. 10 is the top now"},
    {"ask": "What does pop print?", "pop": 1, "focus": ["v1"], "caption": "10: pop takes the top off. The stack is empty now"},
    {"ask": "What does pop print?", "caption": "Empty: the stack is empty, so there is nothing to take off"}
  ]
}
```

```
Input:
3
push
5
push
15
peek

Output:
15
```

```
Input:
2
pop
peek

Output:
Empty
Empty
```

Both `pop` and `peek` must print `Empty` when the stack has nothing in it.
