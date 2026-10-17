#include <stdio.h>

typedef struct Node {
    int v;
    struct Node *l, *r;
} Node;

static Node pool[7];
static int used = 0;

Node *make(int v, Node *l, Node *r) {
    Node *n = &pool[used++];
    n->v = v;
    n->l = l;
    n->r = r;
    return n;
}

void walk(Node *n, int order) {
    if (!n) return;
    if (order == 0) printf(" %d", n->v);
    walk(n->l, order);
    if (order == 1) printf(" %d", n->v);
    walk(n->r, order);
    if (order == 2) printf(" %d", n->v);
}

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    Node *t = make(a, make(b, make(d, NULL, NULL), make(e, make(g, NULL, NULL), NULL)),
                   make(c, NULL, make(f, NULL, NULL)));
    const char *names[] = {"Preorder:", "Inorder:", "Postorder:"};
    for (int k = 0; k < 3; k++) {
        printf("%s", names[k]);
        walk(t, k);
        printf("\n");
    }
    return 0;
}
