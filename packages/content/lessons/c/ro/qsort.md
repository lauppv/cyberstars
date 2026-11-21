Sortarea e ceva de care are nevoie aproape orice program. Am putea scrie de fiecare dată propria sortare, dar C are deja una rapidă în stdlib.h: **qsort**. Poate sorta orice array, de int-uri, de șiruri, de struct-uri. Ca să poată face asta, are nevoie de ajutorul nostru la un singur lucru: cum se compară două valori. I-l dăm ca pointer la funcție

```c
#include <stdio.h>
#include <stdlib.h>

int compara_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
}

int main(void) {
    int v[] = { 42, 7, 19, 3, 25 };
    qsort(v, 5, sizeof(int), compara_int);
    for (int i = 0; i < 5; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    return 0;
}
```

Ieșire

```text
3 7 19 25 42
```

---

qsort primește patru lucruri

1. Array-ul
2. Câte valori are
3. Cât de mare e o valoare, în bytes: `sizeof(int)`
4. Funcția de comparare

qsort nu știe ce e în array, așa că îi dă funcției noastre de comparare doi `const void *`. Un **pointer void** e o adresă fără tip: „aici e ceva, nu știu ce”. Noi știm că e un int, deci îl facem `const int *` cu un cast, apoi îl citim cu `*`

Funcția de comparare trebuie să întoarcă

- un număr negativ când a trebuie să vină înaintea lui b
- un număr pozitiv când a trebuie să vină după b
- 0 când nu contează

---

O scurtătură pe care o vei vedea des e `return x - y;`. Merge pentru numere mici, dar când x și y sunt foarte departe unul de altul, scăderea poate depăși limitele lui int și poate da semnul greșit. Cele două if-uri sunt mereu sigure

Ca să sortezi de la mare la mic, inversează răspunsul: întoarce 1 unde întorceam -1, și invers

---

Sortarea struct-urilor merge la fel. Funcția de comparare primește pointeri la două struct-uri și decide după câmpurile pe care le alegem noi. Când primul câmp e egal, ne putem uita la al doilea, ca ordinea să fie mereu clară

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct rola {
    char eticheta[16];
    int an;
};

int dupa_an(const void *a, const void *b) {
    const struct rola *x = a;
    const struct rola *y = b;
    if (x->an != y->an) {
        return x->an < y->an ? -1 : 1;
    }
    return strcmp(x->eticheta, y->eticheta);
}

int main(void) {
    struct rola role[] = {
        { "payroll", 1971 },
        { "census", 1969 },
        { "orbit", 1971 }
    };
    qsort(role, 3, sizeof(struct rola), dupa_an);
    for (int i = 0; i < 3; i++) {
        printf("%d %s\n", role[i].an, role[i].eticheta);
    }
    return 0;
}
```

Ieșire

```text
1969 census
1971 orbit
1971 payroll
```

Un `void *` poate intra într-un pointer cu tip fără cast, deci `const struct rola *x = a;` e de ajuns. strcmp întoarce deja negativ, 0 sau pozitiv, exact ce vrea qsort

---

## Misiune: Clasamentul operatorilor

La finalul lunii, centrul de calcul își ordonează operatorii după câte lucrări au rulat. Lista de pe perete merge de la cele mai multe lucrări la cele mai puține. Când doi operatori au rulat același număr de lucrări, sunt trecuți în ordine alfabetică

1. Ține fiecare operator într-un struct cu un nume și un număr de lucrări
2. Citește un număr întreg n, apoi n linii, fiecare cu un nume și un număr de lucrări
3. Sortează-i cu qsort și cu o funcție de comparare scrisă de tine: întâi cele mai multe lucrări, iar la lucrări egale, alfabetic după nume
4. Afișează clasamentul, ca în exemplu

n e între 1 și 100. Un nume e un cuvânt de cel mult 15 litere, iar lucrările sunt între 0 și 10000

**Exemplu**

Intrare

```text
4
grace 31
ken 45
alan 31
linus 12
```

Ieșire

```text
1. ken 45
2. alan 31
3. grace 31
4. linus 12
```
