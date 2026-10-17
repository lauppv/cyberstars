#include <stdio.h>
#include <stdlib.h>

struct Node {
    int value;
    struct Node *left;
    struct Node *right;
};

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    struct Node *root = malloc(sizeof(struct Node));
    root->value = a;
    printf("Preorder: %d %d %d %d %d %d %d\n", a, b, d, e, g, c, f);
    printf("Inorder: %d %d %d %d %d %d %d\n", d, b, g, e, a, c, f);
    printf("Postorder: %d %d %d %d %d %d %d\n", d, g, e, b, f, c, a);
    free(root);
    return 0;
}
