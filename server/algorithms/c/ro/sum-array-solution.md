```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Citim cate un numar si il adaugam la suma (pattern acumulator).
    int suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        suma = suma + x;
    }

    printf("%d\n", suma);
    return 0;
}
```
