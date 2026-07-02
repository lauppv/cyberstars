```c
#include <stdio.h>

int main(void) {
    long a, b;
    scanf("%ld %ld", &a, &b);

    long x = a, y = b;
    while (y != 0) {
        long temp = y;
        y = x % y;
        x = temp;
    }
    long gcd = x;
    long lcm = a / gcd * b;

    printf("GCD: %ld\n", gcd);
    printf("LCM: %ld\n", lcm);

    return 0;
}
```
