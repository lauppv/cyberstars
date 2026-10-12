```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef enum { DE_FACUT, IN_LUCRU, GATA } Status;

typedef struct {
    char titlu[100];
    Status status;
} Sarcina;

Sarcina *creeaza_sarcina(const char *titlu) {
    Sarcina *s = malloc(sizeof(Sarcina));
    strcpy(s->titlu, titlu);
    s->status = DE_FACUT;
    return s;
}

void actualizeaza_status(Sarcina *s, Status st) {
    s->status = st;
}

const char *nume_status(Status st) {
    switch (st) {
        case DE_FACUT: return "DE_FACUT";
        case IN_LUCRU:  return "IN_LUCRU";
        case GATA:      return "GATA";
    }
    return "";
}

void afiseaza_sarcina(Sarcina *s) {
    printf("[%s] %s\n", nume_status(s->status), s->titlu);
}

int main(void) {
    int n;
    scanf("%d", &n);

    Sarcina *sarcini[100];
    for (int i = 0; i < n; i++) {
        char titlu[100];
        int cod;
        scanf("%s %d", titlu, &cod);
        sarcini[i] = creeaza_sarcina(titlu);
        actualizeaza_status(sarcini[i], (Status)cod);
    }

    for (int i = 0; i < n; i++) {
        afiseaza_sarcina(sarcini[i]);
    }

    for (int i = 0; i < n; i++) {
        free(sarcini[i]);
    }

    return 0;
}
```
