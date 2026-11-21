```c
#include <stdio.h>

int main(void) {
    int cadre;
    scanf("%d", &cadre);

    int loc[7];
    int folosit_la[7];
    int folosite = 0;
    int ceas = 0;
    int erori = 0;
    int gasite = 0;
    int pagina;

    while (scanf("%d", &pagina) == 1) {
        int gasit = -1;
        for (int s = 0; s < folosite; s++) {
            if (loc[s] == pagina) {
                gasit = s;
            }
        }

        if (gasit != -1) {
            gasite++;
            folosit_la[gasit] = ceas;
        } else {
            erori++;
            int tinta;
            if (folosite < cadre) {
                tinta = folosite;
                folosite++;
            } else {
                tinta = 0;
                for (int s = 1; s < cadre; s++) {
                    if (folosit_la[s] < folosit_la[tinta]) {
                        tinta = s;
                    }
                }
            }
            loc[tinta] = pagina;
            folosit_la[tinta] = ceas;
        }
        ceas++;

        printf("%d:", pagina);
        for (int s = 0; s < cadre; s++) {
            if (s < folosite) {
                printf(" %d", loc[s]);
            } else {
                printf(" -");
            }
        }
        printf(" %s\n", gasit != -1 ? "gasit" : "eroare");
    }
    printf("Erori: %d, gasite: %d\n", erori, gasite);
    return 0;
}
```
