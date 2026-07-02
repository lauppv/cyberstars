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

    Nod *cap = NULL;
    Nod *coada = NULL;

    for (int i = 0; i < n; i++) {
        char comanda[10];
        scanf("%9s", comanda);

        if (strcmp(comanda, "INSERT") == 0) {
            int x;
            scanf("%d", &x);
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
        } else if (strcmp(comanda, "PRINT") == 0) {
            if (cap == NULL) {
                printf("EMPTY\n");
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

    Nod *curent = cap;
    while (curent != NULL) {
        Nod *urmator = curent->urmator;
        free(curent);
        curent = urmator;
    }

    return 0;
}
```
