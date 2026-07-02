```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int power(int base, int exp) {
    int result = 1;
    int i = 0;
    while (i < exp) {
        result = result * base;
        i = i + 1;
    }
    return result;
}

int main(void) {
    int a, b, op;
    while (scanf("%d %d %d", &a, &b, &op) == 3) {
        if (op == 0) {
            break;
        } else if (op == 1) {
            printf("%d\n", add(a, b));
        } else if (op == 2) {
            printf("%d\n", multiply(a, b));
        } else if (op == 3) {
            printf("%d\n", power(a, b));
        }
    }
    return 0;
}
```
