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
    long cmmdc = x;
    long cmmmc = a / cmmdc * b;

    printf("GCD: %ld\n", cmmdc);
    printf("LCM: %ld\n", cmmmc);

    return 0;
}
```
