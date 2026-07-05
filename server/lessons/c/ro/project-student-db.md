E timpul pentru un proiect real. Vom construi un **registru de studenți**, folosind tot ce am învățat: struct-uri, pointeri, memorie dinamică, array-uri și funcții pentru șiruri

Programul gestionează o listă de studenți. Fiecare student are un **nume** și o **notă**. Vom

1. Crea studenți dinamic cu **malloc**
2. Îi stoca într-un array de pointeri
3. Afișa toți studenții
4. Găsi studentul cu cea mai mare notă
5. Elibera memoria

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
    Student s = {"Ritchie", 95};
    printf("%s: %d\n", s.nume, s.nota);
    return 0;
}
```

Și iată cum creăm un student dinamic

```text
Student *creeaza_student(const char *nume, int nota) {
    Student *s = malloc(sizeof(Student));
    strncpy(s->nume, nume, sizeof(s->nume) - 1);
    s->nume[sizeof(s->nume) - 1] = '\0';
    s->nota = nota;
    return s;
}
```

Funcția alocă memorie pe heap, completează câmpurile și întoarce un pointer. Apelantul devine **responsabil** să elibereze acea memorie mai târziu

---

Ca să afișăm toți studenții

```text
void afiseaza_toti(Student *studenti[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", studenti[i]->nume, studenti[i]->nota);
    }
}
```

Observă **studenti[i]->nume** — fiecare element al array-ului este un **pointer către un Student**, așa că folosim **->** în loc de **.**

---

Ca să găsim cel mai bun student

```text
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

## Misiune: Registrul laboratorului de calcul

E anul 1974. Ești operator de tură la laboratorul de calcul al universității. Studenții care termină examenul de programare vin la teletype-ul tău și îți dictează numele și nota — tu le introduci în registru, un student pe rând

Scrie un program care

1. Citește un întreg **n** — numărul de studenți
2. Citește, de **n** ori, un nume și o notă (întreg), și creează un student cu **creeaza_student**, stocând pointerul într-un array
3. Apelează **afiseaza_toti** ca să afișeze fiecare student sub forma **"Nume: Nota"**
4. Apelează **gaseste_cel_mai_bun** și afișează **"Cel mai bun: Nume (Nota)"**
5. Eliberează toată memoria alocată, cu **free**, înainte de final

**Exemplu**

Intrare

```text
4
Ritchie 95
Thompson 82
Kernighan 98
McIlroy 76
```

Ieșire

```text
Ritchie: 95
Thompson: 82
Kernighan: 98
McIlroy: 76
Cel mai bun: Kernighan (98)
```

**Exemplu**

Intrare

```text
2
Ana 88
Mihai 91
```

Ieșire

```text
Ana: 88
Mihai: 91
Cel mai bun: Mihai (91)
```
