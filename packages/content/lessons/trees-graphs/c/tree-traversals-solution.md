```c
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

void preorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    printf("%d ", node->value);
    preorder(node->left);
    preorder(node->right);
}

void inorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    inorder(node->left);
    printf("%d ", node->value);
    inorder(node->right);
}

void postorder(struct Node *node) {
    if (node == NULL) {
        return;
    }
    postorder(node->left);
    postorder(node->right);
    printf("%d ", node->value);
}

void free_tree(struct Node *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
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

    printf("Preorder: ");
    preorder(root);
    printf("\n");
    printf("Inorder: ");
    inorder(root);
    printf("\n");
    printf("Postorder: ");
    postorder(root);
    printf("\n");

    free_tree(root);
    return 0;
}
```
