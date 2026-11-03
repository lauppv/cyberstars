#include <stdio.h>

int main(void) {
    int n, digits = 1;
    scanf("%d", &n);
    while (n >= 10) {
        digits++;
        n /= 100;
    }
    printf("%d\n", digits);
    return 0;
}
