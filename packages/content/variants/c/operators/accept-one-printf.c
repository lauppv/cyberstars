#include <stdio.h>

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);
    printf("%d\n%d\n%d\n%d\n%d\n", x + y, x - y, x * y, x / y, x % y);
    return 0;
}
