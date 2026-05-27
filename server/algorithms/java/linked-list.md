# Hard · Linked List

Implement a **singly linked list** from scratch. Create a `Node` class with `value` and `next` fields, and a `LinkedList` class with `add`, `remove`, and `print` operations.

Process commands from stdin.

### Input

- Line 1: number of commands N
- Next N lines: one of:
  - `add X` — add integer X to the end of the list
  - `remove X` — remove the first occurrence of X (print `Not found` if X is not in the list)
  - `print` — print all elements separated by `->`, or `Empty` if the list is empty

### Output

- For each `print`: elements in order separated by `->`, or `Empty`
- For each failed `remove`: `Not found`

### Examples

```
Input:
6
add 10
add 20
add 30
print
remove 20
print

Output:
10 -> 20 -> 30
10 -> 30
```

```
Input:
4
add 5
remove 5
remove 5
print

Output:
Not found
Empty
```

### Hints

- `Node` holds a value and a reference to the next node.
- `LinkedList` holds a reference to the `head` node.
- For `add`: traverse to the end, set `next` of the last node.
- For `remove`: find the node, link the previous node to `node.next`.
- Special case: removing the head node.
