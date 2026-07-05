```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Divide repeatedly by 10 and count how many divisions bring n to 0.
    // Each division "chops off" the last digit.
    int count = 0;

    // Special case: 0 has one digit, but the loop wouldn't run at all.
    if (n == 0) {
        count = 1;
    } else {
        while (n > 0) {
            count++;
            n = n / 10;
        }
    }

    printf("%d\n", count);
    return 0;
}
```
