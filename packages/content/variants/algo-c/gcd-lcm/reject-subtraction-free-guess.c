#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    int g = 1;
    for (int d = 2; d <= a && d <= b; d++) {
        int x = a, y = b;
        while (x >= d) x -= d;
        while (y >= d) y -= d;
        if (x == 0 && y == 0) g = d;
    }
    printf("GCD: %d\nLCM: %d\n", g, a / g * b);
    return 0;
}
