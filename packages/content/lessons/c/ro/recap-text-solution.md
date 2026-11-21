```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char linie[128];

    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        char *comanda = strtok(linie, " ");
        if (comanda == NULL) {
            continue;
        }

        if (strcmp(comanda, "echo") == 0) {
            char *cuvant = strtok(NULL, " ");
            int primul = 1;
            while (cuvant != NULL) {
                printf(primul ? "%s" : " %s", cuvant);
                primul = 0;
                cuvant = strtok(NULL, " ");
            }
            printf("\n");
        } else if (strcmp(comanda, "add") == 0 || strcmp(comanda, "max") == 0) {
            int e_adunare = strcmp(comanda, "add") == 0;
            long rezultat = 0;
            int numar = 0;
            int gresit = 0;
            char *cuvant = strtok(NULL, " ");
            while (cuvant != NULL) {
                char *sfarsit;
                long n = strtol(cuvant, &sfarsit, 10);
                if (*sfarsit != '\0') {
                    printf("Numar gresit: %s\n", cuvant);
                    gresit = 1;
                    break;
                }
                if (e_adunare) {
                    rezultat = rezultat + n;
                } else if (numar == 0 || n > rezultat) {
                    rezultat = n;
                }
                numar++;
                cuvant = strtok(NULL, " ");
            }
            if (!gresit) {
                printf("%ld\n", rezultat);
            }
        } else {
            printf("Comanda necunoscuta: %s\n", comanda);
        }
    }
    return 0;
}
```
