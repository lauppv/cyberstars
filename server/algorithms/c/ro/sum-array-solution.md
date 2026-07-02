```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        suma += x;
    }

    printf("%d\n", suma);
    return 0;
}
```
