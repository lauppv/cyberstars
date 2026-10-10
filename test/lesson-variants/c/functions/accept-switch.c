#include <stdio.h>

void calculator(int a, int b, char op) {
    int r;
    switch (op) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    case '/': r = a / b; break;
    default:
        printf("Invalid operator\n");
        return;
    }
    printf("%d %c %d = %d\n", a, op, b, r);
}

int main(void) {
    calculator(14, 12, '+');
    calculator(10, 3, '-');
    calculator(5, 4, '*');
    calculator(10, 2, '/');
    calculator(1, 1, 'x');
    return 0;
}
