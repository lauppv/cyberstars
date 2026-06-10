#include <stdio.h>
#include <string.h>

typedef struct {
    char nume[50];
    char telefon[20];
} Contact;

void adauga_contact(Contact *agenda, int *numar, const char *nume, const char *telefon) {
}

void cauta_contact(Contact *agenda, int numar, const char *cautare) {
}

int main(void) {
    Contact agenda[10];
    int numar = 0;

    adauga_contact(agenda, &numar, "Tommy", "0722111222");
    adauga_contact(agenda, &numar, "Lance", "0733222333");
    adauga_contact(agenda, &numar, "Ken", "0744333444");

    cauta_contact(agenda, numar, "Lance");
    cauta_contact(agenda, numar, "Diaz");

    return 0;
}
