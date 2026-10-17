#include <stdio.h>

int val[8], lft[8], rgt[8];

void pre(int i) {
    if (!i) return;
    printf(" %d", val[i]);
    pre(lft[i]);
    pre(rgt[i]);
}

void in(int i) {
    if (!i) return;
    in(lft[i]);
    printf(" %d", val[i]);
    in(rgt[i]);
}

void post(int i) {
    if (!i) return;
    post(lft[i]);
    post(rgt[i]);
    printf(" %d", val[i]);
}

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;
    val[1] = a; val[2] = b; val[3] = c; val[4] = d; val[5] = e; val[6] = f; val[7] = g;
    lft[1] = 2; rgt[1] = 3; lft[2] = 4; rgt[2] = 5; rgt[3] = 6; lft[5] = 7;
    printf("Preorder:");
    pre(1);
    printf("\nInorder:");
    in(1);
    printf("\nPostorder:");
    post(1);
    printf("\n");
    return 0;
}
