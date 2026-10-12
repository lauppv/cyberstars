```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int readings[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &readings[i]);
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", readings[i]);
    }

    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + readings[i];
    }
    printf("%d\n", total);
    printf("%f\n", (double) total / n);
    return 0;
}
```
