Calculatoarele gândesc în **biți** — 0-uri și 1-uri. C ne lasă să lucrăm direct cu acei biți folosind **operatorii pe biți**. Ăsta este nivelul cel mai jos la care poți ajunge fără să scrii asamblare

Numărul **13** în binar este **1101**. Numărul **10** este **1010**. Operatorii pe biți acționează asupra fiecărui bit individual

---

**& (AND)** — ambii biți trebuie să fie 1

```c
#include <stdio.h>

int main(void) {
    int a = 13;   // 1101
    int b = 10;   // 1010
    printf("%d\n", a & b);   // 8 (1000)
    return 0;
}
```

```text
  1101  (13)
& 1010  (10)
------
  1000  (8)
```

Pe fiecare poziție: dacă ambii sunt 1, rezultatul este 1. Altfel 0

---

**| (OR)** — cel puțin un bit trebuie să fie 1

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 13 | 10);   // 15
    return 0;
}
```

```text
  1101  (13)
| 1010  (10)
------
  1111  (15)
```

**^ (XOR)** — exact un bit trebuie să fie 1

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 13 ^ 10);   // 7
    return 0;
}
```

```text
  1101  (13)
^ 1010  (10)
------
  0111  (7)
```

**~ (NOT)** — inversează fiecare bit

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", ~0);   // -1 (toti bitii devin 1)
    return 0;
}
```

---

**Operatorii de shift** mută biții la stânga sau la dreapta

**<< (shift la stânga)** — mută biții la stânga, umple cu 0-uri. Fiecare shift la stânga **înmulțește cu 2**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 5 << 1);   // 10  (101 -> 1010)
    printf("%d\n", 5 << 2);   // 20  (101 -> 10100)
    printf("%d\n", 1 << 3);   // 8   (1 -> 1000)
    return 0;
}
```

**>> (shift la dreapta)** — mută biții la dreapta. Fiecare shift la dreapta **împarte la 2**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 20 >> 1);   // 10
    printf("%d\n", 20 >> 2);   // 5
    return 0;
}
```

**1 << n** ne dă **2^n**. Acesta este unul dintre cele mai folosite trucuri în programare

---

O utilizare clasică: **flag-urile**. Imaginează-ți un personaj de joc cu abilități

```c
#include <stdio.h>

#define POATE_ZBURA   (1 << 0)   // 0001 = 1
#define POATE_INOTA   (1 << 1)   // 0010 = 2
#define POATE_LUPTA   (1 << 2)   // 0100 = 4
#define POATE_VINDECA (1 << 3)   // 1000 = 8

int main(void) {
    int abilitati = POATE_ZBURA | POATE_LUPTA;   // 0101 = 5

    // verifica daca poate zbura
    if (abilitati & POATE_ZBURA) {
        printf("Poate zbura!\n");
    }

    // adauga abilitatea de a inota
    abilitati = abilitati | POATE_INOTA;       // 0111 = 7

    // scoate abilitatea de a zbura
    abilitati = abilitati & ~POATE_ZBURA;      // 0110 = 6

    return 0;
}
```

Un singur **int** stochează mai multe proprietăți da/nu folosind biți individuali. Asta este folosit în sistemele de operare, în protocoalele de rețea și în motoarele de joc. Permisiunile de fișiere din Linux funcționează exact așa

---

## Misiune: Codurile de Acces la Ecluză

Sistemul ecluzei stației folosește flag-uri pe biți pentru a codifica permisiunile de acces. Cu două coduri de securitate, rulează cele patru operații de bază pe biți ca ofițerul de securitate să poată verifica configurația încuietorii.

1. Afișează **a & b** (AND)
2. Afișează **a | b** (OR)
3. Afișează **a ^ b** (XOR)
4. Afișează **a << 2** (shift la stânga cu 2)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `a` — int cu valoarea **12** (binar: 1100)
- `b` — int cu valoarea **10** (binar: 1010)

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
8
14
6
48
```
