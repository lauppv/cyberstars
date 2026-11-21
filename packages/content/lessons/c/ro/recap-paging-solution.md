```c
#include <stdio.h>

int cadrul_paginii[70000];
int pagina_din_cadru[8];
int folosit_la[8];

int main(void) {
    unsigned marime;
    int cadre;
    scanf("%u %d", &marime, &cadre);

    int shift = 0;
    while ((1u << shift) < marime) {
        shift++;
    }
    unsigned masca = marime - 1;

    for (int p = 0; p < 70000; p++) {
        cadrul_paginii[p] = -1;
    }
    for (int f = 0; f < cadre; f++) {
        pagina_din_cadru[f] = -1;
    }

    unsigned adresa;
    int ceas = 0;
    int erori = 0;
    int gasite = 0;
    while (scanf("%u", &adresa) == 1) {
        unsigned pagina = adresa >> shift;
        unsigned offset = adresa & masca;
        int cadru = cadrul_paginii[pagina];
        printf("%u: pagina %u, ", adresa, pagina);

        if (cadru != -1) {
            gasite++;
            printf("gasit, ");
        } else {
            erori++;
            printf("eroare, ");
            cadru = -1;
            for (int f = 0; f < cadre && cadru == -1; f++) {
                if (pagina_din_cadru[f] == -1) {
                    cadru = f;
                }
            }
            if (cadru == -1) {
                cadru = 0;
                for (int f = 1; f < cadre; f++) {
                    if (folosit_la[f] < folosit_la[cadru]) {
                        cadru = f;
                    }
                }
                printf("iese pagina %d, ", pagina_din_cadru[cadru]);
                cadrul_paginii[pagina_din_cadru[cadru]] = -1;
            }
            pagina_din_cadru[cadru] = pagina;
            cadrul_paginii[pagina] = cadru;
        }

        folosit_la[cadru] = ceas;
        ceas++;
        printf("cadrul %d -> %u\n", cadru, ((unsigned)cadru << shift) | offset);
    }
    printf("Erori: %d, gasite: %d\n", erori, gasite);
    return 0;
}
```
