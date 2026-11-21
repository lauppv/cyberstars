```c
#include <stdio.h>

int e_par(int x) {
    return x % 2 == 0;
}

int e_pozitiv(int x) {
    return x > 0;
}

int e_mare(int x) {
    return x > 100;
}

int numara_daca(int v[], int n, int (*test)(int)) {
    int numar = 0;
    for (int i = 0; i < n; i++) {
        if (test(v[i])) {
            numar++;
        }
    }
    return numar;
}

int main(void) {
    int n;
    int v[1000];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &v[i]);
    }

    printf("Pare: %d\n", numara_daca(v, n, e_par));
    printf("Pozitive: %d\n", numara_daca(v, n, e_pozitiv));
    printf("Mari: %d\n", numara_daca(v, n, e_mare));
    return 0;
}
```
