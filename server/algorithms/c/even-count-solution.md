```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int count = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        if (x % 2 == 0) {
            count++;
        }
    }

    printf("%d\n", count);
    return 0;
}
```
