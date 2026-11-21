```c
#include <stdio.h>

void afiseaza_binar(int n) {
    if (n < 2) {
        printf("%d", n);
        return;
    }
    afiseaza_binar(n / 2);
    printf("%d", n % 2);
}

int numara_unu(int n) {
    if (n == 0) {
        return 0;
    }
    return n % 2 + numara_unu(n / 2);
}

int main(void) {
    int n;
    scanf("%d", &n);

    printf("Binar: ");
    afiseaza_binar(n);
    printf("\n");
    printf("Unu: %d\n", numara_unu(n));
    return 0;
}
```
