```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacitate = 2;
    int numar = 0;
    int *v = malloc(capacitate * sizeof(int));
    int x;

    while (scanf("%d", &x) == 1) {
        if (numar == capacitate) {
            capacitate = capacitate * 2;
            int *mai_mare = realloc(v, capacitate * sizeof(int));
            if (mai_mare == NULL) {
                free(v);
                return 1;
            }
            v = mai_mare;
        }
        v[numar] = x;
        numar++;
    }

    long suma = 0;
    for (int i = 0; i < numar; i++) {
        suma = suma + v[i];
    }
    double media = (double)suma / numar;

    printf("Valori: %d\n", numar);
    printf("Capacitate: %d\n", capacitate);
    printf("Peste medie:");
    int afisate = 0;
    for (int i = 0; i < numar; i++) {
        if (v[i] > media) {
            printf(" %d", v[i]);
            afisate++;
        }
    }
    if (afisate == 0) {
        printf(" niciuna");
    }
    printf("\n");

    free(v);
    return 0;
}
```
