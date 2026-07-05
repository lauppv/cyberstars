```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Assume the first number is the minimum, then compare with the rest.
    // If we find something smaller, update the minimum.
    int min;
    scanf("%d", &min);

    for (int i = 1; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x < min) {
            min = x;
        }
    }

    printf("%d\n", min);
    return 0;
}
```
