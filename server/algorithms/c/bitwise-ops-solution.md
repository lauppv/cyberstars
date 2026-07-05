```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // The trick: a power of 2 has exactly one bit set in binary.
    // When you subtract 1, all lower bits flip to 1 and that unique bit becomes 0.
    // So x & (x - 1) clears exactly that bit and the result is 0.
    // Example: 8 = 1000, 7 = 0111, 8 & 7 = 0000.
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x > 0 && (x & (x - 1)) == 0) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }

    return 0;
}
```
