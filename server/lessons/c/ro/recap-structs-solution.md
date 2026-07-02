```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char nume[50];
    char telefon[20];
} Contact;

void adauga_contact(Contact *agenda, int *numar, const char *nume, const char *telefon) {
    strcpy((agenda + *numar)->nume, nume);
    strcpy((agenda + *numar)->telefon, telefon);
    *numar += 1;
}

void cauta_contact(Contact *agenda, int numar, const char *cautare) {
    for (int i = 0; i < numar; i++) {
        if (strcmp((agenda + i)->nume, cautare) == 0) {
            printf("Gasit: %s - %s\n", (agenda + i)->nume, (agenda + i)->telefon);
            return;
        }
    }
    printf("Negasit: %s\n", cautare);
}

int main(void) {
    Contact agenda[100];
    int numar = 0;

    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char nume[50], telefon[20];
        scanf("%s %s", nume, telefon);
        adauga_contact(agenda, &numar, nume, telefon);
    }

    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        char cautare[50];
        scanf("%s", cautare);
        cauta_contact(agenda, numar, cautare);
    }

    return 0;
}
```
