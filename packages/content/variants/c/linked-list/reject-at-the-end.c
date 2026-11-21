#include <stdio.h>
#include <stdlib.h>

struct node { int value; struct node *next; };

struct node *push(struct node *head, int value) {
    struct node *n = malloc(sizeof(struct node));
    n->value = value;
    n->next = NULL;
    if (!head) return n;
    struct node *p = head;
    while (p->next) p = p->next;
    p->next = n;
    return head;
}

int main(void) {
    struct node *head = NULL;
    int x, len = 0, total = 0;
    while (scanf("%d", &x) == 1) head = push(head, x);
    for (struct node *p = head; p; p = p->next) printf("%d -> ", p->value);
    printf("NULL\n");
    for (struct node *p = head; p; p = p->next) { len++; total += p->value; }
    printf("Length: %d\nTotal: %d\n", len, total);
    while (head) { struct node *n = head->next; free(head); head = n; }
    return 0;
}
