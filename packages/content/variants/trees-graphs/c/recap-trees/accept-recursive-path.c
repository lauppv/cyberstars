#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *left, *right;
} Node;

Node *add(Node *n, int value) {
    if (!n) {
        n = calloc(1, sizeof(Node));
        n->value = value;
    } else if (value < n->value) {
        n->left = add(n->left, value);
    } else {
        n->right = add(n->right, value);
    }
    return n;
}

void leaves(Node *n) {
    if (!n) return;
    if (!n->left && !n->right) printf(" %d", n->value);
    leaves(n->left);
    leaves(n->right);
}

void path(Node *n, int target) {
    printf(" %d", n->value);
    if (n->value != target) path(target < n->value ? n->left : n->right, target);
}

void drop(Node *n) {
    if (!n) return;
    drop(n->left);
    drop(n->right);
    free(n);
}

int main(void) {
    int n, x, target;
    Node *root = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        root = add(root, x);
    }
    scanf("%d", &target);

    Node *q[7];
    int depth[7], front = 0, back = 0;
    q[back] = root;
    depth[back++] = 0;
    while (front < back) {
        int d = depth[front];
        printf("Level %d:", d);
        while (front < back && depth[front] == d) {
            Node *cur = q[front++];
            printf(" %d", cur->value);
            if (cur->left) { q[back] = cur->left; depth[back++] = d + 1; }
            if (cur->right) { q[back] = cur->right; depth[back++] = d + 1; }
        }
        printf("\n");
    }
    printf("Leaves:");
    leaves(root);
    printf("\nPath to %d:", target);
    path(root, target);
    printf("\n");
    drop(root);
    return 0;
}
