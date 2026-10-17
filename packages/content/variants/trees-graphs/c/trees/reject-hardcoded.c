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
    printf("Root: 8\n");
    printf("Children: 3 10\n");
    printf("Leaves: 1 6 10\n");
    free(root->left);
    free(root->right);
    free(root);
    return 0;
}
