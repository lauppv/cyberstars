# Hard · Linked List

Implement a **singly linked list** in C. Read commands from stdin and execute them:

- `INSERT x` — insert integer `x` at the **end** of the list
- `PRINT` — print all elements space-separated on one line

Use `malloc` to allocate each node. Each node has an `int data` field and a `struct Node *next` pointer.

### Input

- First line: an integer `N` (number of commands)
- Next `N` lines: a command (`INSERT x` or `PRINT`)

### Output

For each `PRINT` command, output the list elements space-separated. If the list is empty, print `EMPTY`.

### Examples

```
Input:
5
INSERT 10
INSERT 20
INSERT 30
PRINT
INSERT 40
Output:
10 20 30
```

```
Input:
3
PRINT
INSERT 5
PRINT
Output:
EMPTY
5
```

### Hints

- Define a struct: `struct Node { int data; struct Node *next; };`
- Keep a `head` pointer, initially `NULL`.
- For INSERT, allocate a new node with `malloc`, traverse to the end, and link it.
- For PRINT, traverse from `head` and print each node's data.
