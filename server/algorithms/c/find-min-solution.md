```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

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
