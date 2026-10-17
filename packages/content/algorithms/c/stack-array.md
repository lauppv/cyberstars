Implement a **stack** data structure using an array. Read a sequence of commands and process them:

- **push X**: push integer X onto the stack
- **pop**: remove and print the top element, or print `Empty` if the stack is empty
- **peek**: print the top element without removing it, or print `Empty` if the stack is empty

### Input

- First line: an integer `M` (1 <= M <= 2·10^4), the number of commands
- For each command:
  - Line 1: command type (`push`, `pop`, or `peek`)
  - Only for `push`, line 2: the integer X (-10^9 <= X <= 10^9)

### Output

For each `pop` or `peek` command, print one line: the value or `Empty`.

### Examples

```
Input:
5
push
10
push
20
peek
pop
pop
Output:
20
20
10
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
    {"ask": "What does pop print?", "pop": 1, "focus": ["v1"], "caption": "10: pop takes the top off. The stack is empty now"}
  ]
}
```

```
Input:
3
pop
push
5
peek
Output:
Empty
5
```

```
Input:
5
push
1
push
2
pop
pop
pop
Output:
2
1
Empty
```

Once the stack is fully drained, further `pop` calls keep printing `Empty`.
