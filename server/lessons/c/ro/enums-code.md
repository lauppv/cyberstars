#include <stdio.h>

enum Anotimp { PRIMAVARA, VARA, TOAMNA, IARNA };

void afiseaza_anotimp(enum Anotimp a) {
}

int main(void) {
    afiseaza_anotimp(PRIMAVARA);
    afiseaza_anotimp(VARA);
    afiseaza_anotimp(TOAMNA);
    afiseaza_anotimp(IARNA);
    return 0;
}
