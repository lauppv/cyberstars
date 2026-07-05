```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Outer loop: how many lines to print. Inner loop: how many stars per line.
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```
