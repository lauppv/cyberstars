```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga_la_final(struct nod *cap, int id) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = id;
    n->urmator = NULL;
    if (cap == NULL) {
        return n;
    }
    struct nod *p = cap;
    while (p->urmator != NULL) {
        p = p->urmator;
    }
    p->urmator = n;
    return cap;
}

int contine(struct nod *cap, int id) {
    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        if (p->valoare == id) {
            return 1;
        }
    }
    return 0;
}

struct nod *anuleaza(struct nod *cap, int id) {
    struct nod *anterior = NULL;
    struct nod *p = cap;
    while (p != NULL && p->valoare != id) {
        anterior = p;
        p = p->urmator;
    }
    if (p == NULL) {
        return cap;
    }
    if (anterior == NULL) {
        cap = p->urmator;
    } else {
        anterior->urmator = p->urmator;
    }
    free(p);
    return cap;
}

int main(void) {
    struct nod *cap = NULL;
    char linie[64];
    char comanda[16];
    int id;

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        int gasite = sscanf(linie, "%15s %d", comanda, &id);
        if (gasite == 2 && strcmp(comanda, "add") == 0) {
            cap = adauga_la_final(cap, id);
        } else if (gasite == 2 && strcmp(comanda, "cancel") == 0) {
            if (contine(cap, id)) {
                cap = anuleaza(cap, id);
            } else {
                printf("Nicio lucrare %d\n", id);
            }
        } else if (gasite >= 1 && strcmp(comanda, "show") == 0) {
            if (cap == NULL) {
                printf("Coada: goala\n");
            } else {
                printf("Coada:");
                for (struct nod *p = cap; p != NULL; p = p->urmator) {
                    printf(" %d", p->valoare);
                }
                printf("\n");
            }
        }
    }

    while (cap != NULL) {
        struct nod *urmator = cap->urmator;
        free(cap);
        cap = urmator;
    }
    return 0;
}
```
