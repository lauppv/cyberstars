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
        if (root == NULL) {
            root = node;
            continue;
        }
        struct Node *cur = root;
        while (1) {
            if (node->value < cur->value) {
                if (cur->left == NULL) { cur->left = node; break; }
                cur = cur->left;
            } else {
                if (cur->right == NULL) { cur->right = node; break; }
                cur = cur->right;
            }
        }
    }
    scanf("%d", &target);

    printf("Sorted:");
    struct Node *stack[7];
    int top = 0;
    struct Node *cur = root;
    while (top > 0 || cur) {
        while (cur) { stack[top++] = cur; cur = cur->left; }
        cur = stack[--top];
        printf(" %d", cur->value);
        cur = cur->right;
    }
    printf("\n");

    int height = 0;
    for (int i = 0; i < n; i++) {
        int steps = 0;
        struct Node *walk = root;
        while (walk != all[i]) {
            walk = all[i]->value < walk->value ? walk->left : walk->right;
            steps++;
        }
        if (steps > height) height = steps;
    }
    printf("Height: %d\n", height);

    cur = root;
    while (cur && cur->value != target) cur = target < cur->value ? cur->left : cur->right;
    printf("Search %d: %s\n", target, cur ? "found" : "not found");
    for (int i = 0; i < n; i++) free(all[i]);
    return 0;
}
