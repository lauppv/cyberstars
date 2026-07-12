Am văzut deja **+**, **-**, **\***, **/** în lecțiile anterioare. Hai să ne uităm la restul setului de unelte aritmetice al C-ului

```c
#include <stdio.h>

int main(void) {
    int a = 17;
    int b = 5;

    printf("%d\n", a + b);   // adunare
    printf("%d\n", a - b);   // scadere
    printf("%d\n", a * b);   // inmultire
    printf("%d\n", a / b);   // impartire
    printf("%d\n", a % b);   // rest (modulo)

    return 0;
}
```

Ieșire

```text
22
12
85
3
2
```

Cel interesant este **a / b = 3**, nu **3.4**. De ce? **a** și **b** sunt amândoi **int**, deci C face **împărțire întreagă** și aruncă partea zecimală. Am acoperit asta în **variables-float**

---

Operatorul nou este **%**, numit **modulo** (sau "rest")

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 17 % 5);   // 2
    printf("%d\n", 20 % 4);   // 0
    return 0;
}
```

**17 / 5 = 3** cu rest **2**, deci **17 % 5 = 2**. **20 / 4 = 5** exact, deci restul este **0**

Caz de utilizare clasic: verificarea dacă un număr este **par**

```c
#include <stdio.h>

int main(void) {
    int n = 10;
    if (n % 2 == 0) {
        printf("par\n");
    } else {
        printf("impar\n");
    }
    return 0;
}
```

---

C are **scurtături** la îndemână

- **a++** este același lucru cu **a = a + 1**
- **a--** este același lucru cu **a = a - 1**
- **a += 5** este același lucru cu **a = a + 5**
- **a -= 3** este același lucru cu **a = a - 3**
- **a \*= 2** este același lucru cu **a = a \* 2**
- **a /= 4** este același lucru cu **a = a / 4**

Vei vedea **i++** în bucle **for** absolut peste tot

---

Dar **puterile**? C nu are un operator încorporat pentru putere. Folosim **pow()** din biblioteca matematică

```c
#include <stdio.h>
#include <math.h>

int main(void) {
    printf("%f\n", pow(2, 3));   // 8.000000
    return 0;
}
```

**pow()** întoarce mereu un **double**, deci chiar și **2 la puterea 3** iese ca **8.000000**, nu **8**

Ca să folosim **pow()** avem nevoie de **#include <math.h>**. Pe unele sisteme, trebuie și să legi biblioteca matematică cu **-lm** când compilezi, dar platforma noastră se ocupă de asta pentru noi

---

**Ordinea operațiilor** este aceeași ca în matematică: **\*** și **/** înaintea lui **+** și **-**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 2 + 3 * 4);     // 14, nu 20
    printf("%d\n", (2 + 3) * 4);   // 20
    return 0;
}
```

Când ai dubii, **adaugă paranteze**. Oricum fac codul mai ușor de citit

---

## Misiune: Panoul de diagnostic al mainframe-ului

Panoul de diagnostic al mainframe-ului citește două valori de pe consolă și rulează cele cinci operații aritmetice de bază, ca tehnicianul de tură să poată verifica rapid dacă unitatea aritmetică funcționează corect.

Citește două numere întregi **a** și **b** folosind **scanf**, apoi afișează rezultatele lui `a + b`, `a - b`, `a * b`, `a / b` și `a % b` — fiecare pe propria linie. Citește datele direct — nu afișa nicio întrebare înainte de citire.

**Exemplu**

Intrare

```text
17 5
```

Ieșire

```text
22
12
85
3
2
```

**Exemplu**

Intrare

```text
20 4
```

Ieșire

```text
24
16
80
5
0
```
