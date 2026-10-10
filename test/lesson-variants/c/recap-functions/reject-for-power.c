#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int power(int base, int exp) {
    int r = 1;
    for (int i = 0; i < exp; i++) r *= base;
    return r;
}

int main(void) {
    int a, b, op;
    for (;;) {
        if (scanf("%d %d %d", &a, &b, &op) != 3 || op == 0) break;
        if (op == 1) printf("%d\n", add(a, b));
        else if (op == 2) printf("%d\n", multiply(a, b));
        else if (op == 3) printf("%d\n", power(a, b));
    }
    return 0;
}
