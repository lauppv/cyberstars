#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\n%d\n%d\n%.0f\n%d\n", a + b, a - b, a * b, (double) a / b, a % b);
    return 0;
}
