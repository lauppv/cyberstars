#include <stdio.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

int main(void) {
    int a = 8;
    int b = 3;
    int c = 10;
    int d = 1;
    int e = 6;
    struct Node nd = {d, NULL, NULL};
    struct Node ne = {e, NULL, NULL};
    struct Node nb = {b, &nd, &ne};
    struct Node nc = {c, NULL, NULL};
    struct Node na = {a, &nb, &nc};
    struct Node *root = &na;
    printf("Root: %d\n", root->value);
    printf("Children: %d %d\n", root->left->value, root->right->value);
    printf("Leaves: %d %d %d\n", root->left->left->value, root->left->right->value, root->right->value);
    return 0;
}
