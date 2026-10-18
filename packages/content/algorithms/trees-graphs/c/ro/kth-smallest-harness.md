```c
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

#line 1 "main.c"
{{code: a_k_a_cea_mai_mica}}

static char linie[16384];

int main(void) {
    int k;
    fgets(linie, sizeof(linie), stdin);
    scanf("%d", &k);
    struct Nod *radacina = construieste_arbore(linie);
    printf("%d\n", a_k_a_cea_mai_mica(radacina, k));
    elibereaza_arbore(radacina);
    return 0;
}
```
