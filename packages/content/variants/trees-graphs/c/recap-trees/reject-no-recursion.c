#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

int main(void) {
    int n, target;
    scanf("%d", &n);
    struct Node *all[7];
    struct Node *root = NULL;
    for (int i = 0; i < n; i++) {
        struct Node *node = malloc(sizeof(struct Node));
        scanf("%d", &node->value);
        node->left = node->right = NULL;
        all[i] = node;
        if (!root) { root = node; continue; }
        struct Node *cur = root;
        while (1) {
            struct Node **next = node->value < cur->value ? &cur->left : &cur->right;
            if (!*next) { *next = node; break; }
            cur = *next;
        }
    }
    scanf("%d", &target);

    struct Node *queue[7];
    int head = 0, tail = 0, level = 0;
    queue[tail++] = root;
    while (head < tail) {
        int size = tail - head;
        printf("Level %d:", level++);
        for (int i = 0; i < size; i++) {
            struct Node *node = queue[head++];
            printf(" %d", node->value);
            if (node->left) queue[tail++] = node->left;
            if (node->right) queue[tail++] = node->right;
        }
        printf("\n");
    }

    printf("Leaves:");
    struct Node *stack[7];
    int top = 0;
    stack[top++] = root;
    while (top > 0) {
        struct Node *node = stack[--top];
        if (!node->left && !node->right) printf(" %d", node->value);
        if (node->right) stack[top++] = node->right;
        if (node->left) stack[top++] = node->left;
    }

    printf("\nPath to %d:", target);
    struct Node *cur = root;
    while (cur->value != target) {
        printf(" %d", cur->value);
        cur = target < cur->value ? cur->left : cur->right;
    }
    printf(" %d\n", target);
    for (int i = 0; i < n; i++) free(all[i]);
    return 0;
}
