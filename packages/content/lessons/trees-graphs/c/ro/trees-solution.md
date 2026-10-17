```c
#include <stdio.h>
#include <stdlib.h>

struct Nod {
    int valoare;
    struct Nod *stanga;
    struct Nod *dreapta;
};

struct Nod *nod_nou(int valoare) {
    struct Nod *nod = malloc(sizeof(struct Nod));
    nod->valoare = valoare;
    nod->stanga = NULL;
    nod->dreapta = NULL;
    return nod;
}

int main(void) {
    int a = 8;
    int b = 3;
    int c = 10;
    int d = 1;
    int e = 6;

    struct Nod *radacina = nod_nou(a);
    radacina->stanga = nod_nou(b);
    radacina->dreapta = nod_nou(c);
    radacina->stanga->stanga = nod_nou(d);
    radacina->stanga->dreapta = nod_nou(e);

    printf("Radacina: %d\n", radacina->valoare);
    printf("Copii: %d %d\n", radacina->stanga->valoare, radacina->dreapta->valoare);
    printf("Frunze: %d %d %d\n", radacina->stanga->stanga->valoare, radacina->stanga->dreapta->valoare, radacina->dreapta->valoare);

    free(radacina->stanga->stanga);
    free(radacina->stanga->dreapta);
    free(radacina->stanga);
    free(radacina->dreapta);
    free(radacina);
    return 0;
}
```
