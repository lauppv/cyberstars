#include <stdio.h>

int main(void) {
    int a, b;
    printf("Enter a and b: ");
    scanf("%d %d", &a, &b);
    printf("%d\n%d\n%d\n%d\n%d\n", a + b, a - b, a * b, a / b, a % b);
    return 0;
}
