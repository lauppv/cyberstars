#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

struct Node *new_node(int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    struct Node *root = new_node(a);
    root->left = new_node(b);
    root->right = new_node(c);
    root->left->left = new_node(d);
    root->left->right = new_node(e);
    root->right->right = new_node(f);
    root->left->right->left = new_node(g);

    struct Node *stack[8];
    int top = 0;
    printf("Preorder:");
    stack[top++] = root;
    while (top > 0) {
        struct Node *n = stack[--top];
        printf(" %d", n->value);
        if (n->right) stack[top++] = n->right;
        if (n->left) stack[top++] = n->left;
    }
    printf("\nInorder:");
    struct Node *cur = root;
    while (top > 0 || cur) {
        while (cur) {
            stack[top++] = cur;
            cur = cur->left;
        }
        cur = stack[--top];
        printf(" %d", cur->value);
        cur = cur->right;
    }
    printf("\nPostorder:");
    int out[7], k = 0;
    stack[top++] = root;
    while (top > 0) {
        struct Node *n = stack[--top];
        out[k++] = n->value;
        if (n->left) stack[top++] = n->left;
        if (n->right) stack[top++] = n->right;
    }
    while (k > 0) printf(" %d", out[--k]);
    printf("\n");

    free(root->left->right->left);
    free(root->left->left);
    free(root->left->right);
    free(root->right->right);
    free(root->left);
    free(root->right);
    free(root);
    return 0;
}
