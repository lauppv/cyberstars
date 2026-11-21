```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct node {
    int value;
    struct node *next;
};

struct node *append(struct node *head, int id) {
    struct node *n = malloc(sizeof(struct node));
    n->value = id;
    n->next = NULL;
    if (head == NULL) {
        return n;
    }
    struct node *p = head;
    while (p->next != NULL) {
        p = p->next;
    }
    p->next = n;
    return head;
}

int contains(struct node *head, int id) {
    for (struct node *p = head; p != NULL; p = p->next) {
        if (p->value == id) {
            return 1;
        }
    }
    return 0;
}

struct node *cancel(struct node *head, int id) {
    struct node *prev = NULL;
    struct node *p = head;
    while (p != NULL && p->value != id) {
        prev = p;
        p = p->next;
    }
    if (p == NULL) {
        return head;
    }
    if (prev == NULL) {
        head = p->next;
    } else {
        prev->next = p->next;
    }
    free(p);
    return head;
}

int main(void) {
    struct node *head = NULL;
    char line[64];
    char command[16];
    int id;

    while (fgets(line, sizeof(line), stdin) != NULL) {
        int found = sscanf(line, "%15s %d", command, &id);
        if (found == 2 && strcmp(command, "add") == 0) {
            head = append(head, id);
        } else if (found == 2 && strcmp(command, "cancel") == 0) {
            if (contains(head, id)) {
                head = cancel(head, id);
            } else {
                printf("No job %d\n", id);
            }
        } else if (found >= 1 && strcmp(command, "show") == 0) {
            if (head == NULL) {
                printf("Queue: empty\n");
            } else {
                printf("Queue:");
                for (struct node *p = head; p != NULL; p = p->next) {
                    printf(" %d", p->value);
                }
                printf("\n");
            }
        }
    }

    while (head != NULL) {
        struct node *next = head->next;
        free(head);
        head = next;
    }
    return 0;
}
```
