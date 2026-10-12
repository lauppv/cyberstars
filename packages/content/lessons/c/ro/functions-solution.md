```c
#include <stdio.h>

void calculator(int numar1, int numar2, char operator) {
    if (operator == '+') {
        printf("%d %c %d = %d\n", numar1, operator, numar2, numar1 + numar2);
    } else if (operator == '-') {
        printf("%d %c %d = %d\n", numar1, operator, numar2, numar1 - numar2);
    } else if (operator == '*') {
        printf("%d %c %d = %d\n", numar1, operator, numar2, numar1 * numar2);
    } else if (operator == '/') {
        printf("%d %c %d = %d\n", numar1, operator, numar2, numar1 / numar2);
    } else {
        printf("Operator invalid\n");
    }
}

int main(void) {
    calculator(14, 12, '+');
    calculator(10, 3, '-');
    calculator(5, 4, '*');
    calculator(10, 2, '/');
    calculator(1, 1, 'x');
    return 0;
}
```
