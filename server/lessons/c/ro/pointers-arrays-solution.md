```c
#include <stdio.h>

int suma_tablou(int *ptr, int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + *(ptr + i);
    }
    return total;
}

int main(void) {
    int n;
    scanf("%d", &n);

    int numere[100];
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }

    int rezultat = suma_tablou(numere, n);
    printf("%d\n", rezultat);
    return 0;
}
```
