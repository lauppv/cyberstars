```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int linie = 1; linie <= n; linie++) {
        for (int j = 0; j < linie; j++) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
```
