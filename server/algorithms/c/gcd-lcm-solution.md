```c
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d", &a);
    scanf("%d", &b);

    // Euclid's algorithm: repeatedly replace the pair (x, y)
    // with (y, x % y) until y becomes 0. The final x is the GCD.
    int x = a;
    int y = b;
    while (y != 0) {
        int temp = y;
        y = x % y;
        x = temp;
    }
    int gcd = x;

    // Divide by gcd first, then multiply, to avoid large intermediate values.
    int lcm = a / gcd * b;

    printf("GCD: %d\n", gcd);
    printf("LCM: %d\n", lcm);

    return 0;
}
```
