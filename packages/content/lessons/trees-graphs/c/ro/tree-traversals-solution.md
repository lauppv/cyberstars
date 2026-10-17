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

void preordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    printf("%d ", nod->valoare);
    preordine(nod->stanga);
    preordine(nod->dreapta);
}

void inordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    inordine(nod->stanga);
    printf("%d ", nod->valoare);
    inordine(nod->dreapta);
}

void postordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    postordine(nod->stanga);
    postordine(nod->dreapta);
    printf("%d ", nod->valoare);
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

int main(void) {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    int f = 6;
    int g = 7;

    struct Nod *radacina = nod_nou(a);
    radacina->stanga = nod_nou(b);
    radacina->dreapta = nod_nou(c);
    radacina->stanga->stanga = nod_nou(d);
    radacina->stanga->dreapta = nod_nou(e);
    radacina->dreapta->dreapta = nod_nou(f);
    radacina->stanga->dreapta->stanga = nod_nou(g);

    printf("Preordine: ");
    preordine(radacina);
    printf("\n");
    printf("Inordine: ");
    inordine(radacina);
    printf("\n");
    printf("Postordine: ");
    postordine(radacina);
    printf("\n");

    elibereaza_arbore(radacina);
    return 0;
}
```
