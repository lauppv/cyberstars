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
    int x;
    while (scanf("%d", &x) == 1) {
        head = push(head, x);
    }

    for (struct node *p = head; p != NULL; p = p->next) {
        printf("%d -> ", p->value);
    }
    printf("NULL\n");

    int length = 0;
    int total = 0;
    for (struct node *p = head; p != NULL; p = p->next) {
        length++;
        total = total + p->value;
    }
    printf("Length: %d\n", length);
    printf("Total: %d\n", total);

    while (head != NULL) {
        struct node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
```
