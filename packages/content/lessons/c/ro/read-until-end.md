Până acum am știut mereu câte date vin: două numere, o linie sau întâi un număr n. Programele adevărate de multe ori nu știu. Un fișier de jurnal poate avea 3 linii sau 3000. Programul citește pur și simplu până se termină datele

---

fgets ne dă un semnal clar pentru asta. Întoarce **NULL** când nu mai e nimic de citit. Deci putem pune fgets chiar în condiția unei bucle while

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linie[128];
    int numar = 0;
    while (fgets(linie, sizeof(linie), stdin) != NULL) {
        linie[strcspn(linie, "\n")] = '\0';
        numar++;
        printf("%d: %s\n", numar, linie);
    }
    printf("%d linii\n", numar);
    return 0;
}
```

Intrare

```text
incarca banda
ruleaza lucrarea
tipareste
```

Ieșire

```text
1: incarca banda
2: ruleaza lucrarea
3: tipareste
3 linii
```

Fiecare tură a buclei citește o linie. Când se termină datele, fgets întoarce NULL, condiția e falsă și bucla se oprește. Sfârșitul datelor are un nume: **EOF**, prescurtarea de la „end of file”, adică sfârșitul fișierului

---

Cum se termină datele? Când un program citește un fișier, sfârșitul fișierului e sfârșitul. Când scriem noi, trebuie să-l anunțăm: pe Linux apăsăm Ctrl + D la începutul unei linii goale. Aici, după ce apeși Run și îți scrii liniile, apasă **Termină inputul** sub caseta de ieșire. Face același lucru

---

O linie goală nu e sfârșitul. Pentru o linie goală, fgets întoarce un șir care conține doar `'\n'`, iar după ce tăiem linia nouă, un șir gol, cu lungimea 0. Doar EOF oprește bucla

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linii[3][16] = { "bobina 7", "", "bobina 9" };
    for (int i = 0; i < 3; i++) {
        char *linie = linii[i];
        if (strlen(linie) == 0) {
            printf("o linie goala\n");
        } else {
            printf("%s\n", linie);
        }
    }
    return 0;
}
```

Ieșire

```text
bobina 7
o linie goala
bobina 9
```

---

Și scanf poate citi până la sfârșit. Întoarce câte valori a reușit să citească. Cât timp sunt numere, întoarce 1. La final nu mai poate citi nimic și întoarce **EOF**, adică -1

```c
#include <stdio.h>

int main(void) {
    int x;
    int suma = 0;
    while (scanf("%d", &x) == 1) {
        suma = suma + x;
    }
    printf("Suma: %d\n", suma);
    return 0;
}
```

Intrare

```text
10 20
30
```

Ieșire

```text
Suma: 60
```

Să verificăm `== 1` e mai sigur decât să verificăm EOF: dacă datele au un cuvânt acolo unde ar trebui un număr, scanf întoarce 0, iar bucla se oprește și ea, în loc să meargă la nesfârșit

---

## Misiune: Jurnalul turei de noapte

În timpul nopții, operatorii scriu totul într-un jurnal, câte o linie. Unele linii sunt goale, lăsate între două lucrări. Dimineața, șeful de tură vrea jurnalul tipărit din nou, cu numerele liniilor, dar fără liniile goale, plus o numărătoare scurtă la final

1. Citește linii cu fgets până se termină datele. Nu știi câte sunt
2. Pentru fiecare linie care nu e goală, afișează numărul ei în jurnal și linia, ca în exemplu. Liniile goale se numără, dar nu le afișa
3. La final, afișează câte linii a avut jurnalul și câte dintre ele au fost goale

O linie goală nu are nimic pe ea, nici măcar un spațiu. Fiecare linie are cel mult 100 de caractere, iar jurnalul are între 1 și 200 de linii

**Exemplu**

Intrare

```text
start job 12

tape 3 loaded
end
```

Ieșire

```text
1: start job 12
3: tape 3 loaded
4: end
Linii: 4
Goale: 1
```
