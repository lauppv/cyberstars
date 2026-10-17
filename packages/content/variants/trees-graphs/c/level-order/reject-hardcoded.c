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
    printf("Level 0: %d\n", root->value);
    printf("Level 1: %d %d\n", b, c);
    printf("Level 2: %d %d %d\n", d, e, f);
    printf("Level 3: %d\n", g);
    free(root);
    return 0;
}
