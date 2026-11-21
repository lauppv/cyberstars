#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct node { int value; struct node *next; };

struct node *append(struct node *head, int id) {
    struct node *n = malloc(sizeof *n); n->value = id; n->next = head; return n;
}

struct node *cancel(struct node *head, int id) {
    struct node *prev = NULL, *p = head;
    while (p && p->value != id) { prev = p; p = p->next; }
    if (!p) return head;
    if (!prev) head = p->next; else prev->next = p->next;
    free(p);
    return head;
}

int main(void) {
    struct node *head = NULL; char line[64], cmd[16]; int id;
    while (fgets(line, sizeof line, stdin)) {
        int f = sscanf(line, "%15s %d", cmd, &id);
        if (f == 2 && !strcmp(cmd, "add")) head = append(head, id);
        else if (f == 2 && !strcmp(cmd, "cancel")) {
            struct node *p = head; while (p && p->value != id) p = p->next;
            if (p) head = cancel(head, id); else printf("No job %d\n", id);
        } else if (f >= 1 && !strcmp(cmd, "show")) {
            if (!head) puts("Queue: empty");
            else { printf("Queue:"); for (struct node *p = head; p; p = p->next) printf(" %d", p->value); puts(""); }
        }
    }
    while (head) { struct node *n = head->next; free(head); head = n; }
    return 0;
}
