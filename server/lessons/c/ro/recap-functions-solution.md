```c
#include <stdio.h>

int aduna(int a, int b) {
    return a + b;
}

int inmulteste(int a, int b) {
    return a * b;
}

int putere(int baza, int exp) {
    int rezultat = 1;
    int i = 0;
    while (i < exp) {
        rezultat = rezultat * baza;
        i = i + 1;
    }
    return rezultat;
}

int main(void) {
    int a, b, op;
    while (scanf("%d %d %d", &a, &b, &op) == 3) {
        if (op == 0) {
            break;
        } else if (op == 1) {
            printf("%d\n", aduna(a, b));
        } else if (op == 2) {
            printf("%d\n", inmulteste(a, b));
        } else if (op == 3) {
            printf("%d\n", putere(a, b));
        }
    }
    return 0;
}
```
