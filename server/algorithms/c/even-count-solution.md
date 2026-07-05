```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Read N numbers one at a time and count how many are divisible by 2.
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
