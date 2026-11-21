#include <stdio.h>
#include <stdlib.h>

struct node { int value; struct node *next; };

struct node *push(struct node *head, int value) {
    struct node *n = malloc(sizeof(struct node));
    n->value = value;
    n->next = head;
    return n;
}

int main(void) {
    struct node *head = NULL;
    int x, len = 0, total = 0;
    while (scanf("%d", &x) == 1) head = push(head, x);
    for (struct node *p = head; p; p = p->next) printf(p->next ? "%d -> " : "%d\n", p->value);
    for (struct node *p = head; p; p = p->next) { len++; total += p->value; }
    printf("Length: %d\nTotal: %d\n", len, total);
    while (head) { struct node *n = head->next; free(head); head = n; }
    return 0;
}
