```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int citiri[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &citiri[i]);
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", citiri[i]);
    }

    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + citiri[i];
    }
    printf("%d\n", total);
    printf("%f\n", (double) total / n);
    return 0;
}
```
