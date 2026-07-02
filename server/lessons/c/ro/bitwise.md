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

O utilizare clasică: **flag-urile de permisiuni**, exact cum funcționează pe fișierele UNIX

```c
#include <stdio.h>

#define PERM_READ    (1 << 0)   // 001 = 1
#define PERM_WRITE   (1 << 1)   // 010 = 2
#define PERM_EXECUTE (1 << 2)   // 100 = 4

int main(void) {
    int permisiuni = PERM_READ | PERM_WRITE;   // 011 = 3

    // verifica daca are voie sa citeasca
    if (permisiuni & PERM_READ) {
        printf("Poate citi\n");
    }

    // adauga permisiunea de executie
    permisiuni = permisiuni | PERM_EXECUTE;      // 111 = 7

    // scoate permisiunea de scriere
    permisiuni = permisiuni & ~PERM_WRITE;       // 101 = 5

    return 0;
}
```

Un singur **int** stochează mai multe proprietăți da/nu folosind biți individuali. Asta este exact ce face UNIX când afișezi `ls -l` și vezi `rwx` lângă un fișier — fiecare literă este un bit dintr-un întreg

---

## Misiune: Codurile de acces ale terminalului

Centrul de calcul verifică perechi de coduri de securitate primite de la terminale. Operatorul de tură introduce doi întregi, iar sistemul trebuie să afișeze cele patru operații de bază pe biți ca să confirme configurația.

1. Citește doi întregi **a** și **b**
2. Afișează **a & b** (AND)
3. Afișează **a | b** (OR)
4. Afișează **a ^ b** (XOR)
5. Afișează **a << 2** (shift la stânga cu 2)

**Exemplu**

Input

```text
12 10
```

Output

```text
8
14
6
48
```

**Exemplu**

Input

```text
5 3
```

Output

```text
1
7
6
20
```
