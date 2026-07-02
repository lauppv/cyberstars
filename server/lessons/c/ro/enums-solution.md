```c
#include <stdio.h>

enum Anotimp { PRIMAVARA, VARA, TOAMNA, IARNA };

void afiseaza_anotimp(enum Anotimp a) {
    switch (a) {
        case PRIMAVARA: printf("Primavara\n"); break;
        case VARA:       printf("Vara\n");      break;
        case TOAMNA:     printf("Toamna\n");    break;
        case IARNA:      printf("Iarna\n");     break;
    }
}

int main(void) {
    afiseaza_anotimp(PRIMAVARA);
    afiseaza_anotimp(VARA);
    afiseaza_anotimp(TOAMNA);
    afiseaza_anotimp(IARNA);
    return 0;
}
```
