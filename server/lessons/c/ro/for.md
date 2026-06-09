Bun venit la unul dintre **cele mai importante** concepte din programare — bucla **for**. Cu ea, putem cere calculatorului să facă ceva **de multe ori, automat**

Imaginează-ți că vrem să afișăm toate numerele de la **1** la **10**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 1);
    printf("%d\n", 2);
    printf("%d\n", 3);
    // ... și tot așa, de zece ori
    return 0;
}
```

Obositor. Pentru **1** la **1000** este imposibil. **for** ne salvează

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

Rulează-l. Vei vedea numerele de la **1** la **10**, câte unul pe linie

---

Bucla **for** din C are **trei părți** între paranteze, separate prin **;** — exact ca în Java

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

1. **int i = 1** — **punctul de pornire**. Declarăm o variabilă **i** și o setăm la **1**
2. **i <= 10** — **condiția**. Atât timp cât aceasta este **adevărată**, bucla continuă să ruleze
3. **i++** — ce să facă **după fiecare iterație**. Creștem **i** cu 1

Așadar **i** ia valorile **1, 2, 3, ..., 10**. Când **i** devine **11**, condiția **11 <= 10** este **falsă** și bucla se termină

Un mic detaliu: în **C-ul mai vechi** (înainte de C99), nu puteai declara **int i** în interiorul lui **for**. Trebuia să-l declari înainte. În **C-ul modern** (C99 și mai recent, pe care îl folosim), declararea înăuntru este în regulă și idiomatic

Putem număra din 2 în 2, putem număra descrescător, putem face orice vrem

```c
#include <stdio.h>

int main(void) {
    // numărând din 2 în 2
    for (int i = 0; i <= 10; i = i + 2) {
        printf("%d\n", i);
    }

    // numărând descrescător
    for (int i = 10; i >= 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i--** înseamnă **i = i - 1**

---

Fii atent — dacă uităm să actualizăm **i**, obținem o **buclă infinită**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; ) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i** rămâne **1** pentru totdeauna, condiția rămâne **adevărată** pentru totdeauna, iar programul afișează **1** până când ceva îl oprește. Platforma îl oprește după 5 secunde, dar în sisteme reale o buclă infinită îți poate bloca calculatorul. Asigură-te mereu că condiția ta poate deveni falsă

---

## Misiune: Scanner de Provizii

Banda transportoare din depozitul de marfă trece 101 lăzi (numerotate de la **0** la **100**) pe lângă scanner. Majoritatea lăzilor afișează numărul lor, dar lăzile **10** și **50** conțin o livrare specială: **Pizza Margherita**.

Scrie o buclă **for** de la 0 la 100. Pentru fiecare număr, dacă este **10** sau **50**, afișează `Pizza Margherita` în loc de număr. Altfel afișează numărul în sine.

**Exemplu**

Rezultatul tău ar trebui să includă (arătând câteva linii în jurul lăzilor speciale)

```text
9
Pizza Margherita
11
```

Pont: folosește un **if / else** în interiorul buclei ca să decizi ce să afișezi :)
