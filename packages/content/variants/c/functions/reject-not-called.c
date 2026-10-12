#include <stdio.h>

void calculator(int a, int b, char op) {
    printf("%d %c %d\n", a, op, b);
}

int main(void) {
    printf("14 + 12 = 26\n10 - 3 = 7\n5 * 4 = 20\n10 / 2 = 5\nInvalid operator\n");
    return 0;
}
