#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    int x = a, y = b;
    while (y) {
        int t = x % y;
        x = y;
        y = t;
    }
    printf("GCD: %d\nLCM: %d\n", x, a * b);
    return 0;
}
