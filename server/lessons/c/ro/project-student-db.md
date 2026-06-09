E timpul pentru un proiect real! Vom construi o **bază de date cu studenți** care folosește tot ce am învățat: struct-uri, pointeri, memorie dinamică, array-uri și funcții pentru șiruri

Programul gestionează o listă de studenți. Fiecare student are un **nume** și o **notă**. Vom:

1. Crea studenți dinamic cu **malloc**
2. Îi stocăm într-un array
3. Afișăm toți studenții
4. Găsim studentul cu cea mai mare notă
5. Eliberăm memoria

---

Iată struct-ul pe care îl vom folosi

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char nume[50];
    int nota;
} Student;

int main(void) {
    Student s = {"Tommy", 95};
    printf("%s: %d\n", s.nume, s.nota);
    return 0;
}
```

Și iată cum creăm un student dinamic

```c
Student *creeaza_student(const char *nume, int nota) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->nume, nume, sizeof(s->nume) - 1);
    s->nume[sizeof(s->nume) - 1] = '\0';
    s->nota = nota;
    return s;
}
```

Funcția alocă memorie pe heap, completează câmpurile și returnează un pointer. Apelantul este acum **responsabil** să elibereze acea memorie mai târziu

---

Ca să afișăm toți studenții

```c
void afiseaza_toti(Student *studenti[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", studenti[i]->nume, studenti[i]->nota);
    }
}
```

Observă că folosim **studenti[i]->nume** pentru că fiecare element este un **pointer la un Student**

---

Ca să găsim cel mai bun student

```c
Student *gaseste_cel_mai_bun(Student *studenti[], int n) {
    Student *cel_mai_bun = studenti[0];
    for (int i = 1; i < n; i++) {
        if (studenti[i]->nota > cel_mai_bun->nota) {
            cel_mai_bun = studenti[i];
        }
    }
    return cel_mai_bun;
}
```

---

## Misiune: Baza de Date a Echipajului Stației

Stația are nevoie de o bază de date a personalului care să țină evidența numelui și notei de performanță a fiecărui membru al echipajului. Ai piesele de bază mai sus — acum leagă-le într-un sistem funcțional.

1. Completează funcția **afiseaza_toti** ca să afișeze fiecare student sub forma **"Nume: Nota"**
2. Completează funcția **gaseste_cel_mai_bun** ca să returneze un pointer către studentul cu cea mai mare notă
3. În **main**, cei 4 membri ai echipajului sunt deja creați — apelează **afiseaza_toti**, apoi **gaseste_cel_mai_bun**, și afișează-l pe cel mai bun
4. Eliberează toată memoria alocată la final

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- **"Tommy"**, 95
- **"Lance"**, 82
- **"Cortez"**, 98
- **"Rex"**, 76

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
Tommy: 95
Lance: 82
Cortez: 98
Rex: 76
Cel mai bun: Cortez (98)
```
