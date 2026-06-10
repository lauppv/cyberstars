Până acum, fiecare variabilă pe care am creat-o trăiește pe **stivă** (stack) — o regiune de memorie gestionată automat. Când o funcție se termină, variabilele ei de pe stivă sunt distruse. Dar dacă avem nevoie de memorie care **supraviețuiește** după ce funcția returnează? Sau dacă nu știm la compilare **câtă** memorie ne trebuie?

Aici intervine **alocarea dinamică de memorie** — **heap-ul**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    *p = 42;
    printf("%d\n", *p);
    free(p);
    return 0;
}
```

**malloc** (memory allocate) cere sistemului de operare un bloc de memorie pe **heap**. Returnează un **pointer** către acea memorie. **sizeof(int)** îi spune câți octeți avem nevoie (4 pe majoritatea sistemelor)

**free** returnează memoria. Dacă nu o eliberezi, memoria rămâne alocată până când programul tău se termină — asta se numește **memory leak** (scurgere de memorie). Într-un program care rulează mult timp, scurgerile de memorie pot mânca toată memoria RAM

---

Cea mai comună folosință: **array-uri dinamice** — array-uri a căror dimensiune o decidem la runtime

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("Cate scoruri? ");
    scanf("%d", &n);

    int *scoruri = malloc(n * sizeof(int));

    for (int i = 0; i < n; i++) {
        scoruri[i] = (i + 1) * 10;
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", scoruri[i]);
    }

    free(scoruri);
    return 0;
}
```

Folosim **scoruri[i]** exact ca pe un array normal — pentru că numele unui array este oricum un pointer. Singura diferență: noi l-am alocat și **trebuie să-l eliberăm** când terminăm

---

**calloc** este vărul lui malloc. Alocă ȘI inițializează totul cu zero

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = calloc(5, sizeof(int));
    // arr[0] pana la arr[4] sunt toti 0
    printf("%d\n", arr[0]);
    free(arr);
    return 0;
}
```

Cu **malloc**, memoria conține gunoi (orice era acolo înainte). Cu **calloc**, e curată. Folosește calloc când vrei zerouri

---

Regulile de aur ale memoriei dinamice:

1. Fiecare **malloc** sau **calloc** trebuie să aibă un **free** corespunzător
2. Nu folosi niciodată memoria după ce a fost eliberată (**use after free** — un bug periculos)
3. Nu elibera niciodată aceeași memorie de două ori (**double free** — și asta periculos)
4. Verifică întotdeauna dacă malloc a returnat **NULL** (o face când sistemul nu mai are memorie)

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    if (p == NULL) {
        printf("Memorie insuficienta!\n");
        return 1;
    }
    *p = 42;
    printf("%d\n", *p);
    free(p);
    return 0;
}
```

Aceste reguli sună simple dar încălcarea lor cauzează unele dintre cele mai grele bug-uri din lume. Vulnerabilități de securitate din lumea reală precum buffer overflows și use-after-free sunt cauzate de încălcarea acestor reguli

---

## Misiune: Buffer Dinamic pentru Senzori

Stația tocmai a detectat 5 obiecte noi pe radar, dar dimensiunea array-ului de senzori nu este cunoscută la compilare. Alocă un buffer dinamic, umple-l cu citirile, afișează-le și eliberează memoria înainte de următorul ciclu de scanare.

1. Alocă un array dinamic de **5 int-uri** folosind **malloc**
2. Umple-l cu valorile **{2, 4, 6, 8, 10}**
3. Afișează fiecare valoare pe o linie separată
4. **free** la memorie când termini

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- 5 citiri de senzor: **2, 4, 6, 8, 10**

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
2
4
6
8
10
```
