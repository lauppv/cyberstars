```c
#include <stdio.h>

int main(void) {
    int cadre;
    scanf("%d", &cadre);

    int loc[7];
    int folosite = 0;
    int cel_mai_vechi = 0;
    int erori = 0;
    int gasite = 0;
    int pagina;

    while (scanf("%d", &pagina) == 1) {
        int gasit = 0;
        for (int s = 0; s < folosite; s++) {
            if (loc[s] == pagina) {
                gasit = 1;
            }
        }

        if (gasit) {
            gasite++;
        } else {
            erori++;
            if (folosite < cadre) {
                loc[folosite] = pagina;
                folosite++;
            } else {
                loc[cel_mai_vechi] = pagina;
                cel_mai_vechi = (cel_mai_vechi + 1) % cadre;
            }
        }

        printf("%d:", pagina);
        for (int s = 0; s < cadre; s++) {
            if (s < folosite) {
                printf(" %d", loc[s]);
            } else {
                printf(" -");
            }
        }
        printf(" %s\n", gasit ? "gasit" : "eroare");
    }
    printf("Erori: %d, gasite: %d\n", erori, gasite);
    return 0;
}
```
