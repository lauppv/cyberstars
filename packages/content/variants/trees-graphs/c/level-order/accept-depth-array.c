#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value, depth;
    struct Node *left, *right;
} Node;

Node *leaf(int value) {
    Node *n = calloc(1, sizeof(Node));
    n->value = value;
    return n;
}

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    Node *root = leaf(a);
    root->left = leaf(b);
    root->right = leaf(c);
    root->left->left = leaf(d);
    root->right->left = leaf(e);
    root->right->right = leaf(f);
    root->right->left->right = leaf(g);

    Node *q[7];
    int front = 0, back = 0, shown = -1;
    q[back++] = root;
    for (; front < back; front++) {
        Node *n = q[front];
        if (n->depth != shown) {
            if (shown >= 0) printf("\n");
            shown = n->depth;
            printf("Level %d:", shown);
        }
        printf(" %d", n->value);
        Node *kids[2] = {n->left, n->right};
        for (int k = 0; k < 2; k++) {
            if (kids[k]) {
                kids[k]->depth = n->depth + 1;
                q[back++] = kids[k];
            }
        }
    }
    printf("\n");
    for (int i = 0; i < back; i++) free(q[i]);
    return 0;
}
