```c
#include <stdio.h>

int main(void) {
    long n;
    scanf("%ld", &n);

    int count = 0;
    if (n == 0) {
        count = 1;
    } else {
        while (n > 0) {
            count++;
            n /= 10;
        }
    }

    printf("%d\n", count);
    return 0;
}
```
