#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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

// Face dintr-o linie ca "8 4 11 2 null 9 15" noduri legate, nivel cu nivel.
struct Nod *construieste_arbore(char *linie) {
    static struct Nod *coada[1024];
    char *bucata = strtok(linie, " \r\n");
    if (bucata == NULL || strcmp(bucata, "null") == 0) {
        return NULL;
    }
    struct Nod *radacina = nod_nou(atoi(bucata));
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit++] = radacina;
    while ((bucata = strtok(NULL, " \r\n")) != NULL) {
        struct Nod *nod = coada[inceput++];
        if (strcmp(bucata, "null") != 0) {
            nod->stanga = nod_nou(atoi(bucata));
            coada[sfarsit++] = nod->stanga;
        }
        bucata = strtok(NULL, " \r\n");
        if (bucata == NULL) {
            break;
        }
        if (strcmp(bucata, "null") != 0) {
            nod->dreapta = nod_nou(atoi(bucata));
            coada[sfarsit++] = nod->dreapta;
        }
    }
    return radacina;
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

// Afiseaza un arbore pe o linie, nivel cu nivel, ca la intrare.
void afiseaza_arbore(struct Nod *radacina) {
    static struct Nod *coada[1024];
    static char text[16384];
    if (radacina == NULL) {
        printf("null\n");
        return;
    }
    int inceput = 0;
    int sfarsit = 0;
    int folosit = sprintf(text, "%d", radacina->valoare);
    // Unde se termina ultima valoare: null-urile de dupa ea se lasa deoparte.
    int pastrat = folosit;
    coada[sfarsit++] = radacina;
    while (inceput < sfarsit) {
        struct Nod *nod = coada[inceput++];
        struct Nod *copii[2] = {nod->stanga, nod->dreapta};
        for (int i = 0; i < 2; i++) {
            if (copii[i] == NULL) {
                folosit += sprintf(text + folosit, " null");
            } else {
                folosit += sprintf(text + folosit, " %d", copii[i]->valoare);
                pastrat = folosit;
                coada[sfarsit++] = copii[i];
            }
        }
    }
    text[pastrat] = '\0';
    printf("%s\n", text);
}

struct Nod *oglindeste(struct Nod *radacina) {
    // Scrie codul tau aici
    return radacina;
}

static char linie[16384];

int main(void) {
    fgets(linie, sizeof(linie), stdin);
    struct Nod *radacina = construieste_arbore(linie);
    struct Nod *oglindit = oglindeste(radacina);
    afiseaza_arbore(oglindit);
    elibereaza_arbore(oglindit);
    return 0;
}
