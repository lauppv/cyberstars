# Hard · Linked List

Implement a **singly linked list** in C. Read commands from stdin and execute them:

- `insert x` — insert integer `x` at the **end** of the list
- `print` — print all elements space-separated on one line

Use `malloc` to allocate each node. Each node has an `int data` field and a `struct Node *next` pointer.

### Input

- First line: an integer `N` (number of commands)
- For each command:
  - Line 1: command type (`insert` or `print`)
  - Only for `insert`, line 2: the integer `x`

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
