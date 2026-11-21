```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct carte {
    int id;
    char titlu[32];
    int an;
    int imprumutata;
    struct carte *urmator;
};

struct carte *cap = NULL;

struct carte *gaseste(int id) {
    for (struct carte *b = cap; b != NULL; b = b->urmator) {
        if (b->id == id) {
            return b;
        }
    }
    return NULL;
}

void adauga(int id, const char *titlu, int an, int imprumutata) {
    struct carte *b = malloc(sizeof(struct carte));
    b->id = id;
    strcpy(b->titlu, titlu);
    b->an = an;
    b->imprumutata = imprumutata;
    b->urmator = cap;
    cap = b;
}

void scoate(int id) {
    struct carte *anterior = NULL;
    struct carte *b = cap;
    while (b != NULL && b->id != id) {
        anterior = b;
        b = b->urmator;
    }
    if (b == NULL) {
        return;
    }
    if (anterior == NULL) {
        cap = b->urmator;
    } else {
        anterior->urmator = b->urmator;
    }
    free(b);
}

void goleste(void) {
    while (cap != NULL) {
        struct carte *urmator = cap->urmator;
        free(cap);
        cap = urmator;
    }
}

int dupa_an(const void *a, const void *b) {
    const struct carte *x = *(struct carte *const *)a;
    const struct carte *y = *(struct carte *const *)b;
    if (x->an != y->an) {
        return x->an < y->an ? -1 : 1;
    }
    int t = strcmp(x->titlu, y->titlu);
    if (t != 0) {
        return t;
    }
    return x->id < y->id ? -1 : 1;
}

void listeaza(void) {
    struct carte *toate[300];
    int n = 0;
    for (struct carte *b = cap; b != NULL; b = b->urmator) {
        toate[n] = b;
        n++;
    }
    if (n == 0) {
        printf("Catalog gol\n");
        return;
    }
    qsort(toate, n, sizeof(struct carte *), dupa_an);
    for (int i = 0; i < n; i++) {
        printf("%d %d %s%s\n", toate[i]->id, toate[i]->an, toate[i]->titlu,
               toate[i]->imprumutata ? " (imprumutata)" : "");
    }
}

void salveaza(const char *fisier) {
    FILE *f = fopen(fisier, "w");
    if (f == NULL) {
        printf("Nu pot deschide %s\n", fisier);
        return;
    }
    for (struct carte *b = cap; b != NULL; b = b->urmator) {
        fprintf(f, "%d %s %d %d\n", b->id, b->titlu, b->an, b->imprumutata);
    }
    fclose(f);
}

void incarca(const char *fisier) {
    FILE *f = fopen(fisier, "r");
    if (f == NULL) {
        printf("Nu pot deschide %s\n", fisier);
        return;
    }
    goleste();
    int id, an, imprumutata;
    char titlu[32];
    while (fscanf(f, "%d %31s %d %d", &id, titlu, &an, &imprumutata) == 4) {
        adauga(id, titlu, an, imprumutata);
    }
    fclose(f);
}

int main(void) {
    char linie[128];
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        char comanda[16];
        char cuvant[64];
        int id;
        int an;
        if (sscanf(linie, "%15s", comanda) != 1) {
            continue;
        }

        if (strcmp(comanda, "add") == 0 &&
            sscanf(linie, "%*s %d %31s %d", &id, cuvant, &an) == 3) {
            if (gaseste(id) != NULL) {
                printf("Cartea %d exista deja\n", id);
            } else {
                adauga(id, cuvant, an, 0);
            }
        } else if (strcmp(comanda, "list") == 0) {
            listeaza();
        } else if (strcmp(comanda, "save") == 0 && sscanf(linie, "%*s %63s", cuvant) == 1) {
            salveaza(cuvant);
        } else if (strcmp(comanda, "load") == 0 && sscanf(linie, "%*s %63s", cuvant) == 1) {
            incarca(cuvant);
        } else if (sscanf(linie, "%*s %d", &id) == 1) {
            struct carte *b = gaseste(id);
            if (b == NULL) {
                printf("Nu exista cartea %d\n", id);
            } else if (strcmp(comanda, "remove") == 0) {
                scoate(id);
            } else if (strcmp(comanda, "borrow") == 0) {
                if (b->imprumutata) {
                    printf("Cartea %d e deja imprumutata\n", id);
                } else {
                    b->imprumutata = 1;
                }
            } else if (strcmp(comanda, "return") == 0) {
                if (!b->imprumutata) {
                    printf("Cartea %d nu e imprumutata\n", id);
                } else {
                    b->imprumutata = 0;
                }
            }
        }
    }
    goleste();
    return 0;
}
```
