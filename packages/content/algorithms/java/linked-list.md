Implement a **singly linked list** from scratch. Create a `Node` class with `value` and `next` fields, and a `LinkedList` class with `add`, `remove`, and `print` operations.

Process commands from stdin.

### Input

- Line 1: number of commands N (1 <= N <= 2·10^4)
- For each command:
  - Line 1: command type (`add`, `remove`, or `print`)
  - Only for `add` and `remove`, line 2: the integer X (any `int` value)

Behavior:

- `add X`: add integer X to the end of the list
- `remove X`: remove the first occurrence of X (print `Not found` if X is not in the list)
- `print`: print all elements separated by `->`, or `Empty` if the list is empty

### Output

- For each `print`: elements in order separated by `->`, or `Empty`
- For each failed `remove`: `Not found`

### Examples

```
Input:
6
add
10
add
20
add
30
print
remove
20
print

Output:
10 -> 20 -> 30
10 -> 30
```

```visual
{
  "type": "boxes",
  "caption": "A linked list is a chain of nodes: each holds its value and a next reference to the node after it. head points at the first node, and the last node's next is null. Now the list is empty: head is null.",
  "null": "null",
  "boxes": [
    {"id": "head", "name": "head", "to": null, "shown": true},
    {"id": "n10", "fields": [{"name": "value", "value": 10}, {"name": "next", "to": null}]},
    {"id": "n20", "fields": [{"name": "value", "value": 20}, {"name": "next", "to": null}]},
    {"id": "n30", "fields": [{"name": "value", "value": 30}, {"name": "next", "to": null}]}
  ],
  "steps": [
    {"title": "add 10", "focus": ["head"], "ask": "Is the list empty?", "show": ["n10"], "point": {"head": "n10"}, "caption": "Yes, head is null, so head now points at the new node 10, whose next is null"},
    {"title": "add 20", "focus": ["n10"], "ask": "Where does 20 go?", "show": ["n20"], "point": {"n10.next": "n20"}, "caption": "At the end: 10's next now points at the new node 20, and 20's next is null"},
    {"title": "add 30", "focus": ["n20"], "ask": "Where does 30 go?", "show": ["n30"], "point": {"n20.next": "n30"}, "caption": "At the end: 20's next now points at the new node 30, and 30's next is null"},
    {"title": "print", "focus": ["n10", "n20", "n30"], "caption": "print follows the arrows from head: 10, 20, 30, and null ends the list. It prints 10 -> 20 -> 30"},
    {"title": "remove 20", "focus": ["n10", "n20"], "ask": "Which arrow leads to 20?", "point": {"n10.next": "n30"}, "caption": "10's next. It now skips 20 and points at 30, the node after 20"},
    {"remove": ["n20"], "caption": "Nothing points at 20 any more, so it is out of the list"},
    {"title": "print", "focus": ["n10", "n30"], "caption": "print follows the arrows from head: 10, then 30, and null ends the list. It prints 10 -> 30"}
  ]
}
```

```
Input:
4
add
5
remove
5
remove
5
print

Output:
Not found
Empty
```

```
Input:
5
add
1
add
2
add
3
remove
1
print

Output:
2 -> 3
```

Removing the **head** node means the list's `head` reference itself has to
move to the second node. There's no "previous" node to relink.
