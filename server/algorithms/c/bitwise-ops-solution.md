```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        long x;
        scanf("%ld", &x);
        if (x > 0 && (x & (x - 1)) == 0) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }

    return 0;
}
```
