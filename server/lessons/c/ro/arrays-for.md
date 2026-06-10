Avem un array de scoruri. Vrem să facem ceva cu fiecare. **Am putea** face

```c
#include <stdio.h>

int main(void) {
    int scoruri[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", scoruri[0]);
    printf("%d\n", scoruri[1]);
    printf("%d\n", scoruri[2]);
    printf("%d\n", scoruri[3]);
    printf("%d\n", scoruri[4]);
    return 0;
}
```

Repetitiv. **Interzis**, cum am spus în lecțiile anterioare :)

Bucla clasică **for** din C merge mână în mână cu array-urile

```c
#include <stdio.h>

int main(void) {
    int scoruri[5] = { 80, 95, 60, 72, 88 };

    for (int i = 0; i < 5; i++) {
        printf("%d\n", scoruri[i]);
    }

    return 0;
}
```

Am folosit **i < 5**, **nu** **i <= 5**. De ce? Indicii merg de la **0** la **marime - 1**. Pentru **5** elemente, indicii sunt **0, 1, 2, 3, 4**. **i = 5** ar fi **în afara limitelor**, și deja știm cât de periculos este asta în C

---

Hardcodarea lui **5** în buclă este fragilă. Dacă adăugăm sau eliminăm un element, trebuie să ne amintim să actualizăm bucla. Folosește în schimb trucul **sizeof**

```c
#include <stdio.h>

int main(void) {
    int scoruri[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scoruri) / sizeof(scoruri[0]);

    for (int i = 0; i < n; i++) {
        printf("%d\n", scoruri[i]);
    }
    return 0;
}
```

Acum bucla funcționează indiferent câte elemente are array-ul. Adaugă sau elimină un scor, rulează din nou, funcționează pur și simplu

---

Un șablon clasic: **adunarea** numerelor

```c
#include <stdio.h>

int main(void) {
    int preturi[] = { 10, 20, 30, 40 };
    int n = sizeof(preturi) / sizeof(preturi[0]);

    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + preturi[i];
    }
    printf("%d\n", total);   // 100
    return 0;
}
```

Începe cu **total = 0**, parcurge fiecare element, adaugă-l. Vei scrie acest gen de buclă de multe ori în cariera ta. Citește-o linie cu linie și asigură-te că înțelegi **de ce** funcționează :)

---

**O notă despre funcții și array-uri**: așa cum am menționat în lecția anterioară, când pasezi un array unei funcții, trucul **sizeof** **încetează să funcționeze** (array-ul devine un pointer). Soluția standard: pasează mărimea ca parametru separat

```c
#include <stdio.h>

void afiseaza_tot(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d\n", arr[i]);
    }
}

int main(void) {
    int scoruri[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scoruri) / sizeof(scoruri[0]);
    afiseaza_tot(scoruri, n);
    return 0;
}
```

Acesta este un idiom foarte comun în C. Obișnuiește-te să-l scrii :)

---

## Misiune: Analiza Array-ului de Senzori

Senzorii externi ai stației tocmai au livrat un lot de citiri. Comandantul Rex are nevoie de un rezumat complet: fiecare citire individuală, totalul și media.

1. Afișează fiecare scor pe linia lui proprie (folosește o buclă **for**)
2. Afișează **totalul** tuturor scorurilor
3. Afișează **media** (cast la **double** ca să eviți împărțirea de întregi — folosește **(double) total / n**)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `scoruri` — un array de int cu valorile **{80, 95, 60, 72, 88}**

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
80
95
60
72
88
395
79.000000
```
