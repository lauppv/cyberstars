```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Nod {
    int data;
    struct Nod *urmator;
} Nod;

int main(void) {
    int n;
    scanf("%d", &n);

    // Pastram doi pointeri: cap = inceputul listei, coada = ultimul nod.
    // coada ne ajuta sa inseram la final in O(1), fara sa parcurgem lista.
    Nod *cap = NULL;
    Nod *coada = NULL;

    for (int i = 0; i < n; i++) {
        char comanda[15];
        scanf("%14s", comanda);

        if (strcmp(comanda, "insereaza") == 0) {
            int x;
            scanf("%d", &x);

            // Alocam un nod nou in heap si il legam la coada listei.
            Nod *nod = malloc(sizeof(Nod));
            nod->data = x;
            nod->urmator = NULL;

            if (cap == NULL) {
                cap = nod;
                coada = nod;
            } else {
                coada->urmator = nod;
                coada = nod;
            }
        } else if (strcmp(comanda, "afiseaza") == 0) {
            if (cap == NULL) {
                printf("Goala\n");
            } else {
                Nod *curent = cap;
                int primul = 1;
                while (curent != NULL) {
                    if (!primul) {
                        printf(" ");
                    }
                    printf("%d", curent->data);
                    primul = 0;
                    curent = curent->urmator;
                }
                printf("\n");
            }
        }
    }

    // Eliberam memoria alocata pentru fiecare nod (evitam memory leak).
    Nod *curent = cap;
    while (curent != NULL) {
        Nod *urmator = curent->urmator;
        free(curent);
        curent = urmator;
    }

    return 0;
}
```
