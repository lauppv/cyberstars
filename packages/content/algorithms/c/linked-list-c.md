Implement a **singly linked list** in C. Read commands from stdin and execute them:

- `insert x`: insert integer `x` at the **end** of the list
- `print`: print all elements space-separated on one line

Use `malloc` to allocate each node. Each node has an `int data` field and a `struct Node *next` pointer.

### Input

- First line: an integer `N` (1 <= N <= 2·10^4), the number of commands
- For each command:
  - Line 1: command type (`insert` or `print`)
  - Only for `insert`, line 2: the integer `x` (-10^9 <= x <= 10^9)

### Output

For each `print` command, output the list elements space-separated. If the list is empty, print `Empty`.

### Examples

```
Input:
5
insert
10
insert
20
insert
30
print
insert
40
Output:
10 20 30
```

```visual
{
  "type": "boxes",
  "caption": "A linked list is a chain of nodes: each holds its data and a next pointer to the node after it. head points at the first node, and the last node's next is NULL. Now the list is empty: head is NULL.",
  "boxes": [
    {"id": "head", "name": "head", "to": null, "shown": true},
    {"id": "n10", "fields": [{"name": "data", "value": 10}, {"name": "next", "to": null}]},
    {"id": "n20", "fields": [{"name": "data", "value": 20}, {"name": "next", "to": null}]},
    {"id": "n30", "fields": [{"name": "data", "value": 30}, {"name": "next", "to": null}]},
    {"id": "n40", "fields": [{"name": "data", "value": 40}, {"name": "next", "to": null}]}
  ],
  "steps": [
    {"title": "insert 10", "focus": ["head"], "ask": "Is the list empty?", "show": ["n10"], "point": {"head": "n10"}, "caption": "Yes, head is NULL, so head now points at the new node 10, whose next is NULL"},
    {"title": "insert 20", "focus": ["n10"], "ask": "Where does 20 go?", "show": ["n20"], "point": {"n10.next": "n20"}, "caption": "At the end: 10's next now points at the new node 20, and 20's next is NULL"},
    {"title": "insert 30", "focus": ["n20"], "ask": "Where does 30 go?", "show": ["n30"], "point": {"n20.next": "n30"}, "caption": "At the end: 20's next now points at the new node 30, and 30's next is NULL"},
    {"title": "print", "focus": ["n10", "n20", "n30"], "caption": "print follows the arrows from head: 10, 20, 30, and NULL ends the list. It prints 10 20 30"},
    {"title": "insert 40", "focus": ["n30"], "ask": "Where does 40 go?", "show": ["n40"], "point": {"n30.next": "n40"}, "caption": "At the end: 30's next now points at the new node 40. The print came before it, so the output stays 10 20 30"}
  ]
}
```

```
Input:
3
print
insert
5
print
Output:
Empty
5
```

```
Input:
2
insert
7
print
Output:
7
```

A list with a single node still prints just that one value, no trailing space.
