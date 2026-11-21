```c
#include <stdio.h>
#include <stdlib.h>

struct proces {
    char nume[8];
    int sosire;
    int executie;
    int index;
    int asteptare;
    int raspuns;
};

int dupa_sosire(const void *a, const void *b) {
    const struct proces *x = a;
    const struct proces *y = b;
    if (x->sosire != y->sosire) {
        return x->sosire < y->sosire ? -1 : 1;
    }
    return x->index < y->index ? -1 : 1;
}

int main(void) {
    int n;
    struct proces p[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %d %d", p[i].nume, &p[i].sosire, &p[i].executie);
        p[i].index = i;
    }

    qsort(p, n, sizeof(struct proces), dupa_sosire);

    int ceas = 0;
    for (int i = 0; i < n; i++) {
        if (ceas < p[i].sosire) {
            printf("%d-%d idle\n", ceas, p[i].sosire);
            ceas = p[i].sosire;
        }
        printf("%d-%d %s\n", ceas, ceas + p[i].executie, p[i].nume);
        ceas = ceas + p[i].executie;
        p[i].raspuns = ceas - p[i].sosire;
        p[i].asteptare = p[i].raspuns - p[i].executie;
    }

    struct proces dupa_intrare[20];
    for (int i = 0; i < n; i++) {
        dupa_intrare[p[i].index] = p[i];
    }

    double total_asteptare = 0;
    double total_raspuns = 0;
    for (int i = 0; i < n; i++) {
        printf("%s: asteptare %d, raspuns %d\n", dupa_intrare[i].nume,
               dupa_intrare[i].asteptare, dupa_intrare[i].raspuns);
        total_asteptare = total_asteptare + dupa_intrare[i].asteptare;
        total_raspuns = total_raspuns + dupa_intrare[i].raspuns;
    }
    printf("Asteptare medie: %.2f\n", total_asteptare / n);
    printf("Raspuns mediu: %.2f\n", total_raspuns / n);
    return 0;
}
```
