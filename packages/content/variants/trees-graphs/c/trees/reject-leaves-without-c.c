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
    int a = 8;
    int b = 3;
    int c = 10;
    int d = 1;
    int e = 6;
    struct Node *root = new_node(a);
    root->left = new_node(b);
    root->right = new_node(c);
    root->left->left = new_node(d);
    root->left->right = new_node(e);
    printf("Root: %d\n", root->value);
    printf("Children: %d %d\n", root->left->value, root->right->value);
    printf("Leaves: %d %d\n", root->left->left->value, root->left->right->value);
    free(root->left->left);
    free(root->left->right);
    free(root->left);
    free(root->right);
    free(root);
    return 0;
}
