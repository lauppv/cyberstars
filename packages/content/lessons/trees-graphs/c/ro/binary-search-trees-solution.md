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

struct Nod *insereaza(struct Nod *nod, int valoare) {
    if (nod == NULL) {
        return nod_nou(valoare);
    }
    if (valoare < nod->valoare) {
        nod->stanga = insereaza(nod->stanga, valoare);
    } else {
        nod->dreapta = insereaza(nod->dreapta, valoare);
    }
    return nod;
}

void inordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    inordine(nod->stanga);
    printf("%d ", nod->valoare);
    inordine(nod->dreapta);
}

int inaltime(struct Nod *nod) {
    if (nod == NULL) {
        return -1;
    }
    int stanga = inaltime(nod->stanga);
    int dreapta = inaltime(nod->dreapta);
    if (stanga > dreapta) {
        return 1 + stanga;
    }
    return 1 + dreapta;
}

int cauta(struct Nod *nod, int cautat) {
    if (nod == NULL) {
        return 0;
    }
    if (cautat == nod->valoare) {
        return 1;
    }
    if (cautat < nod->valoare) {
        return cauta(nod->stanga, cautat);
    }
    return cauta(nod->dreapta, cautat);
}

int main(void) {
    int n;
    scanf("%d", &n);
    struct Nod *radacina = NULL;
    for (int i = 0; i < n; i++) {
        int valoare;
        scanf("%d", &valoare);
        radacina = insereaza(radacina, valoare);
    }
    int cautat;
    scanf("%d", &cautat);

    printf("Sortat: ");
    inordine(radacina);
    printf("\n");
    printf("Inaltime: %d\n", inaltime(radacina));
    if (cauta(radacina, cautat)) {
        printf("Cautare %d: gasit\n", cautat);
    } else {
        printf("Cautare %d: negasit\n", cautat);
    }

    elibereaza_arbore(radacina);
    return 0;
}
```
