```c
#include <stdio.h>

int main(void) {
    int numar;
    scanf("%d", &numar);

    // Impartim repetat la 10 si numaram cate impartiri fac numarul sa devina 0.
    // Fiecare impartire "sterge" ultima cifra.
    int numarCifre = 0;

    // Cazul special: 0 are o singura cifra, dar bucla nu s-ar executa deloc.
    if (numar == 0) {
        numarCifre = 1;
    } else {
        while (numar > 0) {
            numarCifre++;
            numar = numar / 10;
        }
    }

    printf("%d\n", numarCifre);
    return 0;
}
```
