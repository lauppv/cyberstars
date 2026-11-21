#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct node { int value; struct node *next; };

struct node *append(struct node *head, int id) {
    struct node **pp = &head;
    while (*pp) pp = &(*pp)->next;
    *pp = calloc(1, sizeof **pp);
    (*pp)->value = id;
    return head;
}

struct node *cancel(struct node *head, int id) {
    for (struct node **pp = &head; *pp; pp = &(*pp)->next) {
        if ((*pp)->value == id) {
            struct node *gone = *pp;
            *pp = gone->next;
            free(gone);
            break;
        }
    }
    return head;
}

int main(void) {
    struct node *q = NULL;
    char cmd[32];
    int id;
    while (scanf("%31s", cmd) == 1) {
        if (!strcmp(cmd, "show")) {
            if (!q) { puts("Queue: empty"); continue; }
            printf("Queue:");
            for (struct node *p = q; p; p = p->next) printf(" %d", p->value);
            putchar('\n');
        } else if (scanf("%d", &id) == 1) {
            if (!strcmp(cmd, "add")) q = append(q, id);
            else {
                struct node *p = q;
                while (p && p->value != id) p = p->next;
                if (p) q = cancel(q, id);
                else printf("No job %d\n", id);
            }
        }
    }
    while (q) { struct node *n = q->next; free(q); q = n; }
    return 0;
}
