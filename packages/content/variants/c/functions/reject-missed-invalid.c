#include <stdio.h>

void calculator(int a, int b, char op) {
    if (op == '+') printf("%d + %d = %d\n", a, b, a + b);
    else if (op == '-') printf("%d - %d = %d\n", a, b, a - b);
    else if (op == '*') printf("%d * %d = %d\n", a, b, a * b);
    else printf("%d / %d = %d\n", a, b, a / b);
}

int main(void) {
    calculator(14, 12, '+');
    calculator(10, 3, '-');
    calculator(5, 4, '*');
    calculator(10, 2, '/');
    calculator(1, 1, 'x');
    return 0;
}
