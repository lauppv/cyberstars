```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Read one number at a time and add it to the sum (accumulator pattern).
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        sum = sum + x;
    }

    printf("%d\n", sum);
    return 0;
}
```
