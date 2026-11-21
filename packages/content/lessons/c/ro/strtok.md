O linie de text ține de multe ori mai multe bucăți: o comandă și argumentele ei, sau valori cu virgule între ele. Tăierea unei linii în bucăți se numește împărțire (splitting), iar fiecare bucată e un **token**. În C, funcția pentru asta e **strtok**, din string.h

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[] = "incarca banda ruleaza";
    char *cuvant = strtok(linie, " ");
    while (cuvant != NULL) {
        printf("[%s]\n", cuvant);
        cuvant = strtok(NULL, " ");
    }
    return 0;
}
```

Ieșire

```text
[incarca]
[banda]
[ruleaza]
```

---

strtok lucrează în doi pași, și asta e partea ciudată

- Primul apel primește șirul: `strtok(linie, " ")`. Întoarce un pointer la primul token
- Fiecare apel următor primește **NULL** în loc de șir: `strtok(NULL, " ")`. NULL înseamnă „continuă în același șir ca înainte”. Întoarce tokenul următor
- Când nu mai sunt tokenuri, întoarce NULL, iar bucla noastră while se oprește

Al doilea argument e o listă de separatori. Fiecare caracter din ea contează ca separator

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[] = "rosu, verde,,albastru";
    char *cuvant = strtok(linie, ", ");
    while (cuvant != NULL) {
        printf("%s\n", cuvant);
        cuvant = strtok(NULL, ", ");
    }
    return 0;
}
```

Ieșire

```text
rosu
verde
albastru
```

`", "` înseamnă „o virgulă sau un spațiu”. Separatorii lipiți unul de altul contează ca o singură tăietură, deci cele două virgule nu fac un token gol

---

Cum ține minte strtok unde a rămas? Păstrează un pointer într-o variabilă static din interiorul ei, la fel ca variabilele static scrise de noi. De aceea apelurile următoare au nevoie doar de NULL

Mai mult, strtok ne schimbă șirul. Peste fiecare separator de după un token scrie un `'\0'`, deci fiecare token devine un șir separat, chiar în interiorul lui linie. După strtok, linie nu mai e linia întreagă

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[] = "incarca banda";
    strtok(linie, " ");
    printf("%s\n", linie);
    return 0;
}
```

Ieșire

```text
incarca
```

De aici vin două reguli

1. Dă-i lui strtok un array pe care îl putem schimba, ca `char linie[]`, niciodată un șir literal ca `char *linie = "incarca banda"`. Scrierea într-un literal oprește programul cu eroare
2. Dacă mai avem nevoie de linia întreagă, o copiem întâi cu strcpy

---

## Misiune: Numărătorul de cuvinte

Un operator de teleimprimantă scrie mesajele repede și nu e atent la spații și virgule. Înainte ca un mesaj să plece, stația vrea să știe ce cuvinte are

1. Citește o linie cu fgets și taie linia nouă de la final
2. Împarte-o în cuvinte. Un spațiu sau o virgulă desparte două cuvinte și pot fi mai multe la rând
3. Afișează fiecare cuvânt cu lungimea lui, ca în exemplu
4. La final, afișează câte cuvinte au fost și cel mai lung dintre ele. Dacă două cuvinte sunt la fel de lungi, păstrează-l pe primul

Linia are cel mult 100 de caractere și cel puțin un cuvânt

**Exemplu**

Intrare

```text
load,tape  run, print
```

Ieșire

```text
load (4)
tape (4)
run (3)
print (5)
Cuvinte: 4
Cel mai lung: print
```
