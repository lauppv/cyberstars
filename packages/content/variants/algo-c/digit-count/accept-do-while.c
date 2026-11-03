#include <stdio.h>

int main(void) {
    int n, digits = 0;
    scanf("%d", &n);
    do {
        digits++;
        n /= 10;
    } while (n);
    printf("%d\n", digits);
    return 0;
}
