```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

int main(void) {
    int n;
    scanf("%d", &n);

    // We keep two pointers: head = start of the list, tail = last node.
    // tail lets us insert at the end in O(1) without walking the list.
    Node *head = NULL;
    Node *tail = NULL;

    for (int i = 0; i < n; i++) {
        char cmd[10];
        scanf("%9s", cmd);

        if (strcmp(cmd, "insert") == 0) {
            int x;
            scanf("%d", &x);

            // Allocate a new node on the heap and link it at the tail of the list.
            Node *node = malloc(sizeof(Node));
            node->data = x;
            node->next = NULL;

            if (head == NULL) {
                head = node;
                tail = node;
            } else {
                tail->next = node;
                tail = node;
            }
        } else if (strcmp(cmd, "print") == 0) {
            if (head == NULL) {
                printf("Empty\n");
            } else {
                Node *cur = head;
                int first = 1;
                while (cur != NULL) {
                    if (!first) {
                        printf(" ");
                    }
                    printf("%d", cur->data);
                    first = 0;
                    cur = cur->next;
                }
                printf("\n");
            }
        }
    }

    // Free the memory allocated for each node (avoid a memory leak).
    Node *cur = head;
    while (cur != NULL) {
        Node *next = cur->next;
        free(cur);
        cur = next;
    }

    return 0;
}
```
