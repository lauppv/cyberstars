#include <stdio.h>

void calculator(int number1, int number2, char operator) {
    if (operator == '+') {
        int result = number1 + number2;
        printf("%d %c %d = %d\n", number1, operator, number2, result);
    } else {
        printf("Invalid operator\n");
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
