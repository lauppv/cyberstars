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
    radacina->dreapta->stanga = nod_nou(e);
    radacina->dreapta->dreapta = nod_nou(f);
    radacina->dreapta->stanga->dreapta = nod_nou(g);

    struct Nod *coada[7];
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit] = radacina;
    sfarsit++;
    int nivel = 0;
    while (inceput < sfarsit) {
        int marime = sfarsit - inceput;
        printf("Nivelul %d: ", nivel);
        for (int i = 0; i < marime; i++) {
            struct Nod *nod = coada[inceput];
            inceput++;
            printf("%d ", nod->valoare);
            if (nod->stanga != NULL) {
                coada[sfarsit] = nod->stanga;
                sfarsit++;
            }
            if (nod->dreapta != NULL) {
                coada[sfarsit] = nod->dreapta;
                sfarsit++;
            }
        }
        printf("\n");
        nivel++;
    }

    elibereaza_arbore(radacina);
    return 0;
}
```
