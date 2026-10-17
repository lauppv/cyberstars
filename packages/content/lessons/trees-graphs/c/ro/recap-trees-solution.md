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

void afiseaza_frunze(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    if (nod->stanga == NULL && nod->dreapta == NULL) {
        printf("%d ", nod->valoare);
    }
    afiseaza_frunze(nod->stanga);
    afiseaza_frunze(nod->dreapta);
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

    printf("Frunze: ");
    afiseaza_frunze(radacina);
    printf("\n");

    printf("Drum pana la %d: ", cautat);
    struct Nod *nod = radacina;
    while (nod->valoare != cautat) {
        printf("%d ", nod->valoare);
        if (cautat < nod->valoare) {
            nod = nod->stanga;
        } else {
            nod = nod->dreapta;
        }
    }
    printf("%d\n", nod->valoare);

    elibereaza_arbore(radacina);
    return 0;
}
```
