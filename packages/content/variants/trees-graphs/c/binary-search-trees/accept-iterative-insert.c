#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *left, *right;
} Node;

void walk(Node *n) {
    if (n == NULL) return;
    walk(n->left);
    printf(" %d", n->value);
    walk(n->right);
}

int depth(Node *n) {
    if (n == NULL) return -1;
    int l = depth(n->left), r = depth(n->right);
    return (l > r ? l : r) + 1;
}

void release(Node *n) {
    if (n == NULL) return;
    release(n->left);
    release(n->right);
    free(n);
}

int main(void) {
    int n, target;
    Node *root = NULL;
    scanf("%d", &n);
    while (n-- > 0) {
        Node *fresh = calloc(1, sizeof(Node));
        scanf("%d", &fresh->value);
        Node **spot = &root;
        while (*spot != NULL) {
            spot = fresh->value < (*spot)->value ? &(*spot)->left : &(*spot)->right;
        }
        *spot = fresh;
    }
    scanf("%d", &target);
    printf("Sorted:");
    walk(root);
    printf("\nHeight: %d\n", depth(root));
    Node *cur = root;
    while (cur != NULL && cur->value != target) {
        cur = target < cur->value ? cur->left : cur->right;
    }
    printf("Search %d: %s\n", target, cur != NULL ? "found" : "not found");
    release(root);
    return 0;
}
