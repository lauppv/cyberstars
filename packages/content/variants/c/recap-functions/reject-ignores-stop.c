#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int power(int base, int exp) {
    int r = 1;
    while (exp > 0) { r *= base; exp--; }
    return r;
}

int main(void) {
    int a, b, op;
    while (scanf("%d %d %d", &a, &b, &op) == 3) {
        if (op == 1) printf("%d\n", add(a, b));
        else if (op == 2) printf("%d\n", multiply(a, b));
        else if (op == 3) printf("%d\n", power(a, b));
    }
    return 0;
}
