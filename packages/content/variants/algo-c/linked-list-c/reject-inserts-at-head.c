#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

int main(void) {
    int n;
    char cmd[16];
    Node *head = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%15s", cmd);
        if (strcmp(cmd, "insert") == 0) {
            Node *fresh = malloc(sizeof(Node));
            scanf("%d", &fresh->data);
            fresh->next = head;
            head = fresh;
        } else if (!head) {
            puts("Empty");
        } else {
            for (Node *p = head; p; p = p->next) printf(p == head ? "%d" : " %d", p->data);
            putchar('\n');
        }
    }
    return 0;
}
