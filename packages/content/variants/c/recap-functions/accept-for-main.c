#include <stdio.h>

int add(int a, int b) { return a + b; }

int multiply(int a, int b) { return a * b; }

int power(int base, int exp) {
    int acc = 1;
    while (exp-- > 0) acc *= base;
    return acc;
}

int main(void) {
    int x, y, code;
    for (;;) {
        if (scanf("%d %d %d", &x, &y, &code) != 3 || code == 0) break;
        switch (code) {
        case 1: printf("%d\n", add(x, y)); break;
        case 2: printf("%d\n", multiply(x, y)); break;
        case 3: printf("%d\n", power(x, y)); break;
        }
    }
    return 0;
}
