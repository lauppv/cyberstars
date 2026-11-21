```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct operator {
    char nume[16];
    int lucrari;
};

int dupa_lucrari(const void *a, const void *b) {
    const struct operator *x = a;
    const struct operator *y = b;
    if (x->lucrari != y->lucrari) {
        return x->lucrari > y->lucrari ? -1 : 1;
    }
    return strcmp(x->nume, y->nume);
}

int main(void) {
    int n;
    struct operator operatori[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%15s %d", operatori[i].nume, &operatori[i].lucrari);
    }

    qsort(operatori, n, sizeof(struct operator), dupa_lucrari);

    for (int i = 0; i < n; i++) {
        printf("%d. %s %d\n", i + 1, operatori[i].nume, operatori[i].lucrari);
    }
    return 0;
}
```
