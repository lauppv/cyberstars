#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int power(int base, int exp) {
    int result = 1, done = 0;
    while (done < exp) {
        result = multiply(result, base);
        done = add(done, 1);
    }
    return result;
}

static int run(int a, int b, int op) {
    if (op == 1) return add(a, b);
    if (op == 2) return multiply(a, b);
    return power(a, b);
}

int main(void) {
    int a, b, op;
    scanf("%d %d %d", &a, &b, &op);
    while (op != 0) {
        printf("%d\n", run(a, b, op));
        if (scanf("%d %d %d", &a, &b, &op) != 3) break;
    }
    return 0;
}
