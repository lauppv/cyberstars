#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node {
    int data;
    struct Node *next;
};

static void append(struct Node **head, int x) {
    struct Node *fresh = malloc(sizeof *fresh);
    fresh->data = x;
    fresh->next = NULL;
    while (*head) head = &(*head)->next;
    *head = fresh;
}

int main(void) {
    int n;
    char cmd[16];
    struct Node *head = NULL;
    scanf("%d", &n);
    while (n-- > 0 && scanf("%15s", cmd) == 1) {
        if (cmd[0] == 'i') {
            int x;
            scanf("%d", &x);
            append(&head, x);
        } else if (!head) {
            puts("Empty");
        } else {
            for (struct Node *p = head; p; p = p->next) printf(p == head ? "%d" : " %d", p->data);
            putchar('\n');
        }
    }
    while (head) {
        struct Node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
