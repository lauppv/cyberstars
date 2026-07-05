```c
#include <stdio.h>

typedef struct {
    char nume[50];
    int nota;
} Student;

int main(void) {
    int n;
    scanf("%d", &n);

    Student studenti[50];
    for (int i = 0; i < n; i++) {
        scanf("%49s", studenti[i].nume);
        scanf("%d", &studenti[i].nota);
    }

    // Insertion sort: la pasul i, primii i studenti sunt deja sortati.
    // Il mutam pe studenti[i] in pozitia corecta, deplasand la dreapta
    // orice student cu nota mai mare. Insertion sort este stabil pentru
    // ca folosim > (nu >=), deci elementele egale isi pastreaza ordinea.
    for (int i = 1; i < n; i++) {
        Student cheie = studenti[i];
        int j = i - 1;
        while (j >= 0 && studenti[j].nota > cheie.nota) {
            studenti[j + 1] = studenti[j];
            j--;
        }
        studenti[j + 1] = cheie;
    }

    for (int i = 0; i < n; i++) {
        printf("%s %d\n", studenti[i].nume, studenti[i].nota);
    }

    return 0;
}
```
