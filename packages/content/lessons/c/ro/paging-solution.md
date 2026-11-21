```c
#include <stdio.h>

int main(void) {
    unsigned marime;
    int n;
    int tabel[64];
    scanf("%u %d", &marime, &n);
    for (int p = 0; p < n; p++) {
        scanf("%d", &tabel[p]);
    }

    int shift = 0;
    while ((1u << shift) < marime) {
        shift++;
    }
    unsigned masca = marime - 1;

    unsigned adresa;
    int erori = 0;
    while (scanf("%u", &adresa) == 1) {
        unsigned pagina = adresa >> shift;
        unsigned offset = adresa & masca;
        printf("%u: pagina %u, offset %u -> ", adresa, pagina, offset);
        if (pagina >= (unsigned)n || tabel[pagina] == -1) {
            printf("eroare de pagina\n");
            erori++;
        } else {
            printf("%u\n", (unsigned)tabel[pagina] * marime + offset);
        }
    }
    printf("Erori de pagina: %d\n", erori);
    return 0;
}
```
