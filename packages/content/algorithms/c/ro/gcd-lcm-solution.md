```c
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d", &a);
    scanf("%d", &b);

    // Algoritmul lui Euclid: inlocuim in mod repetat perechea (x, y)
    // cu (y, x % y) pana cand y devine 0. Ultimul x este CMMDC.
    int x = a;
    int y = b;
    while (y != 0) {
        int temp = y;
        y = x % y;
        x = temp;
    }
    int cmmdc = x;

    // Impartim intai la cmmdc, apoi inmultim, ca sa evitam valori intermediare mari.
    int cmmmc = a / cmmdc * b;

    printf("CMMDC: %d\n", cmmdc);
    printf("CMMMC: %d\n", cmmmc);

    return 0;
}
```
