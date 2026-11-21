An array keeps its values side by side, in one block of memory. To grow it, we need realloc, and to put a value in the middle, we must move everything after it

A **linked list** keeps each value in its own small block, called a **node**. Every node also holds a pointer to the next node. The nodes can sit anywhere in memory: the pointers hold them together like a chain

```text
head -> [ 3 | * ] -> [ 7 | * ] -> [ 9 | * ] -> NULL
```

---

A node is a struct with a value and a pointer to the next node, which is a struct of the same kind

```c
#include <stdio.h>

struct node {
    int value;
    struct node *next;
};

int main(void) {
    struct node second = { 7, NULL };
    struct node first = { 3, &second };
    printf("%d -> %d\n", first.value, first.next->value);
    return 0;
}
```

Output

```text
3 -> 7
```

A struct can't hold another whole struct of its own type inside it, it would never end. But it can hold a pointer to one, and that's all we need. The last node's next is NULL: that's how we know the chain ends there

---

We make nodes with malloc and link them with their next pointers. To walk through the list, we start at the first node, the **head**, and follow next until we reach NULL

```c
#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

int main(void) {
    struct node *c = malloc(sizeof(struct node));
    c->value = 9;
    c->next = NULL;

    struct node *b = malloc(sizeof(struct node));
    b->value = 7;
    b->next = c;

    struct node *head = malloc(sizeof(struct node));
    head->value = 3;
    head->next = b;

    for (struct node *p = head; p != NULL; p = p->next) {
        printf("%d\n", p->value);
    }

    free(head);
    free(b);
    free(c);
    return 0;
}
```

Output

```text
3
7
9
```

`p = p->next` is the step that moves us along the chain, like `i++` in an array loop

---

Adding a value at the front is quick, whatever the length of the list: make a node, point its next to the old head, and the new node becomes the head

```c
#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct node *push(struct node *head, int value) {
    struct node *n = malloc(sizeof(struct node));
    n->value = value;
    n->next = head;
    return n;
}

int main(void) {
    struct node *head = NULL;
    head = push(head, 9);
    head = push(head, 7);
    head = push(head, 3);
    for (struct node *p = head; p != NULL; p = p->next) {
        printf("%d\n", p->value);
    }
    return 0;
}
```

Output

```text
3
7
9
```

The function returns the new head, so we call it like this: `head = push(head, 5);`. An empty list is just `struct node *head = NULL;`, and push works on it too

---

When we're done, every node must be freed. But careful: after `free(p)`, we must not read `p->next` any more. So we save the next node first

```c
#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct node *push(struct node *head, int value) {
    struct node *n = malloc(sizeof(struct node));
    n->value = value;
    n->next = head;
    return n;
}

int main(void) {
    struct node *head = NULL;
    for (int i = 1; i <= 3; i++) {
        head = push(head, i);
    }

    int freed = 0;
    while (head != NULL) {
        struct node *next = head->next;
        free(head);
        head = next;
        freed++;
    }
    printf("freed %d nodes\n", freed);
    return 0;
}
```

Output

```text
freed 3 nodes
```

---

## Mission: The Job Chain

The mainframe keeps its waiting jobs in a chain. New jobs are always put at the front, so the newest job is the first one. The operator wants to see the whole chain, how long it is, and how many minutes the jobs need together

1. Write a function **struct node \*push(struct node \*head, int value)** that adds a node at the front of the list and returns the new head
2. Read whole numbers until the input ends: the minutes of each job. Push each one onto the list
3. Walk the list and print it as in the example, with `->` between the values and `NULL` at the end
4. Walk it again to count the nodes and add up their values, and print both
5. Free every node at the end

There is at least one job and at most 1000. Each one needs from 1 to 500 minutes

**Example**

Input

```text
7 3 9
```

Output

```text
9 -> 3 -> 7 -> NULL
Length: 3
Total: 19
```
