```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char nume[50];
    int nota;
} Student;

Student *creeaza_student(const char *nume, int nota) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->nume, nume, sizeof(s->nume) - 1);
    s->nume[sizeof(s->nume) - 1] = '\0';
    s->nota = nota;
    return s;
}

void afiseaza_toti(Student *studenti[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", studenti[i]->nume, studenti[i]->nota);
    }
}

Student *gaseste_cel_mai_bun(Student *studenti[], int n) {
    Student *cel_mai_bun = studenti[0];
    for (int i = 1; i < n; i++) {
        if (studenti[i]->nota > cel_mai_bun->nota) {
            cel_mai_bun = studenti[i];
        }
    }
    return cel_mai_bun;
}

int main(void) {
    int n;
    scanf("%d", &n);

    Student *db[n];
    char nume[50];
    int nota;

    for (int i = 0; i < n; i++) {
        scanf("%49s %d", nume, &nota);
        db[i] = creeaza_student(nume, nota);
    }

    afiseaza_toti(db, n);

    Student *cel_mai_bun = gaseste_cel_mai_bun(db, n);
    printf("Cel mai bun: %s (%d)\n", cel_mai_bun->nume, cel_mai_bun->nota);

    for (int i = 0; i < n; i++) {
        free(db[i]);
    }

    return 0;
}
```
