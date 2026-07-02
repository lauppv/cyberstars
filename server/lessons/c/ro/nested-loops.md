Am văzut buclele **for**. Acum hai să punem o buclă **înăuntrul** alteia — o **buclă imbricată**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("(%d, %d) ", i, j);
        }
        printf("\n");
    }
    return 0;
}
```

Output

```text
(1, 1) (1, 2) (1, 3)
(2, 1) (2, 2) (2, 3)
(3, 1) (3, 2) (3, 3)
```

**Bucla exterioară** controlează **liniile**, **bucla interioară** controlează **coloanele**. Pentru fiecare valoare a lui **i**, bucla interioară rulează **complet** de la început până la sfârșit. Citește output-ul cu atenție și parcurge codul în minte

---

O utilizare clasică a buclelor imbricate: **afișarea unui model**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\n");
    }
    return 0;
}
```

Output

```text
*
* *
* * *
* * * *
* * * * *
```

Observă că bucla interioară merge **până la i**, nu până la 5. Când **i = 1**, afișăm 1 stea. Când **i = 3**, afișăm 3 stele. Așa construim un **triunghi**

---

Bucle imbricate cu tablouri: imaginează-ți o **tablă a înmulțirii**

```c
#include <stdio.h>

int main(void) {
    int numere[] = {2, 3, 4};
    int n = 3;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%d * %d = %d\n", numere[i], numere[j], numere[i] * numere[j]);
        }
    }
    return 0;
}
```

Asta afișează **fiecare combinație** de două elemente din tablou. Dacă tabloul are **n** elemente, buclele imbricate ne dau **n \* n** combinații. Când auzi "toate perechile", gândește-te la bucle imbricate

---

## Misiune: Jurnalul liniilor de imprimantă

Imprimanta liniară a centrului de calcul primește o comandă: numărul de linii de tipărit. Fiecare linie **i** trebuie să conțină numerele de la **1** până la **i**, ca un test de calibrare a capului de tipărire.

1. Citește un întreg **n** din input — numărul de linii
2. Scrie **bucle for imbricate**: bucla exterioară merge de la **1** la **n**, bucla interioară afișează numerele de la **1** la **i**, separate prin spațiu
3. Afișează `printf("\n")` la finalul fiecărei linii

**Exemplu**

Input

```text
5
```

Output

```text
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
```

**Exemplu**

Input

```text
3
```

Output

```text
1
1 2
1 2 3
```
