#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char nume[50];
    int nota;
} Student;

Student *creeaza_student(const char *nume, int nota) {
    Student *s = malloc(sizeof(Student));
    strcpy(s->nume, nume);
    s->nota = nota;
    return s;
}

void afiseaza_toti(Student *studenti[], int n) {
}

Student *gaseste_cel_mai_bun(Student *studenti[], int n) {
    return NULL;
}

int main(void) {
    int n = 4;
    Student *db[4];

    db[0] = creeaza_student("Tommy", 95);
    db[1] = creeaza_student("Lance", 82);
    db[2] = creeaza_student("Cortez", 98);
    db[3] = creeaza_student("Rex", 76);

    afiseaza_toti(db, n);

    Student *cel_mai_bun = gaseste_cel_mai_bun(db, n);
    printf("Cel mai bun: %s (%d)\n", cel_mai_bun->nume, cel_mai_bun->nota);

    for (int i = 0; i < n; i++) {
        free(db[i]);
    }

    return 0;
}
