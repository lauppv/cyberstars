Buclele **for** și **while** își fac treaba de la început până la sfârșit. Dar dacă, în mijlocul unei bucle, vrem să spunem „ok, e suficient, oprește-te"? Sau „sari peste asta, treci la următoarea"?

C ne oferă două cuvinte cheie pentru asta: **break** și **continue**

---

**break** **oprește** bucla complet. Iterațiile rămase nu se mai întâmplă

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 100; i++) {
        if (i == 5) {
            break;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Ieșire

```text
0
1
2
3
4
```

I-am spus buclei să meargă până la **99**, dar de îndată ce **i** a devenit **5**, **break** a intrat în acțiune și bucla s-a terminat

Un exemplu real: căutarea unei valori într-un array

```c
#include <stdio.h>

int main(void) {
    int valori[] = { 10, 25, 7, 42, 13 };
    int n = sizeof(valori) / sizeof(valori[0]);
    int tinta = 42;

    for (int i = 0; i < n; i++) {
        if (valori[i] == tinta) {
            printf("Am gasit %d la pozitia %d\n", tinta, i);
            break;
        }
        printf("Verific %d...\n", valori[i]);
    }
    return 0;
}
```

Bucla se oprește de îndată ce găsim ce căutăm. **break** ne economisește timp

---

**continue** este diferit. Nu oprește bucla — doar **sare peste restul** iterației curente și **trece la următoarea**

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 10; i++) {
        if (i == 5) {
            continue;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Ieșire

```text
0
1
2
3
4
6
7
8
9
```

**5** lipsește. Când **i** a fost **5**, **continue** a sărit peste **printf** și bucla a continuat

Un exemplu real: afișează doar numerele **pare**

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i <= 10; i++) {
        if (i % 2 != 0) {
            continue;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Output: **0 2 4 6 8 10**

---

Ambele cuvinte cheie funcționează la fel în **while**, nu doar în **for**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (1) {   // tine minte: 1 este "true" in C
        if (i >= 5) {
            break;
        }
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

**while (1)** ar fi în mod normal infinit, dar **break** ne lasă să scăpăm

---

O mică avertizare: **break** și **continue** pot face codul mai greu de citit dacă abuzezi de ele. Folosește-le când fac logica mai clară, nu doar ca să pară cod deștept

---

## Misiune: Inspecția sălii de cartele perforate

Faci inspecția anuală a sălii cu cititoare de cartele perforate, numerotate de la **1** la **20**. Un cititor este marcat ca **sigilat pentru reparații** — trebuie **sărit** cu **continue**, fără să-l afișezi. Un alt cititor declanșează **alarma de fum** — de îndată ce ajungi la el, **oprești** inspecția cu **break** (fără să-l afișezi nici pe el).

1. Citește două numere întregi din input: **sigilat** și **alarma**
2. Parcurge cititoarele de la **1** la **20** cu o buclă **for**
3. Dacă numărul curent este egal cu **sigilat**, sari peste el cu **continue**
4. Dacă numărul curent este egal cu **alarma**, oprește bucla cu **break**
5. Altfel, afișează numărul cititorului

**Exemplu**

Intrare

```text
13 17
```

Ieșire

```text
1
2
3
4
5
6
7
8
9
10
11
12
14
15
16
```

**Exemplu**

Intrare

```text
5 10
```

Ieșire

```text
1
2
3
4
6
7
8
9
```
