Să punem noduri în față e rapid, dar așa primim prima dată cea mai nouă valoare. O coadă, ca oamenii la un ghișeu, are nevoie de invers: valorile noi merg la final. Iar uneori o valoare trebuie să plece din mijlocul listei

Folosim același nod ca în lecția trecută

```c
#include <stdio.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

int main(void) {
    struct nod al_doilea = { 7, NULL };
    struct nod primul = { 3, &al_doilea };
    printf("%d -> %d\n", primul.valoare, primul.urmator->valoare);
    return 0;
}
```

Ieșire

```text
3 -> 7
```

---

Ca să adăugăm la final, mergem până la ultimul nod, cel al cărui urmator e NULL, și agățăm nodul nou acolo. Lista goală e cazul special: nodul nou devine capul

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga_la_final(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = NULL;

    if (cap == NULL) {
        return n;
    }
    struct nod *p = cap;
    while (p->urmator != NULL) {
        p = p->urmator;
    }
    p->urmator = n;
    return cap;
}

int main(void) {
    struct nod *cap = NULL;
    cap = adauga_la_final(cap, 3);
    cap = adauga_la_final(cap, 7);
    cap = adauga_la_final(cap, 9);
    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        printf("%d\n", p->valoare);
    }
    return 0;
}
```

Ieșire

```text
3
7
9
```

Uită-te la buclă: se oprește cât timp p e încă pe ultimul nod, pentru că verifică `p->urmator`, nu p. Acolo trebuie să fim, ca să-i schimbăm câmpul urmator

---

Căutarea unei valori e o simplă parcurgere

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga_la_final(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = NULL;

    if (cap == NULL) {
        return n;
    }
    struct nod *p = cap;
    while (p->urmator != NULL) {
        p = p->urmator;
    }
    p->urmator = n;
    return cap;
}

int contine(struct nod *cap, int valoare) {
    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        if (p->valoare == valoare) {
            return 1;
        }
    }
    return 0;
}

int main(void) {
    struct nod *cap = NULL;
    cap = adauga_la_final(cap, 3);
    cap = adauga_la_final(cap, 7);
    cap = adauga_la_final(cap, 9);
    printf("7: %d\n", contine(cap, 7));
    printf("5: %d\n", contine(cap, 5));
    return 0;
}
```

Ieșire

```text
7: 1
5: 0
```

---

Scoaterea unui nod e partea grea. Ca să scoatem un nod, nodul **dinaintea** lui trebuie să sară peste el și să arate spre cel de după el

```text
inainte:   [ 3 ] -> [ 7 ] -> [ 9 ] -> NULL
scoatem 7: [ 3 ] ---------> [ 9 ] -> NULL
```

Așa că, în timp ce mergem, ținem doi pointeri: nodul curent și cel dinaintea lui, anterior. Capul nu are niciun nod înainte, deci e iar un caz special: dacă pleacă capul, nodul următor devine capul nou

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga_la_final(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = NULL;

    if (cap == NULL) {
        return n;
    }
    struct nod *p = cap;
    while (p->urmator != NULL) {
        p = p->urmator;
    }
    p->urmator = n;
    return cap;
}

struct nod *scoate_valoare(struct nod *cap, int valoare) {
    struct nod *anterior = NULL;
    struct nod *p = cap;
    while (p != NULL && p->valoare != valoare) {
        anterior = p;
        p = p->urmator;
    }
    if (p == NULL) {
        return cap;
    }
    if (anterior == NULL) {
        cap = p->urmator;
    } else {
        anterior->urmator = p->urmator;
    }
    free(p);
    return cap;
}

int main(void) {
    struct nod *cap = NULL;
    cap = adauga_la_final(cap, 3);
    cap = adauga_la_final(cap, 7);
    cap = adauga_la_final(cap, 9);
    cap = scoate_valoare(cap, 7);
    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        printf("%d\n", p->valoare);
    }
    return 0;
}
```

Ieșire

```text
3
9
```

Dacă valoarea nu e în listă, bucla merge până la capăt, p e NULL și nu se schimbă nimic. Altfel, legăm peste nod și îl eliberăm. Pleacă doar primul nod cu acea valoare

---

Să le punem la lucru

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga_la_final(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = NULL;
    if (cap == NULL) {
        return n;
    }
    struct nod *p = cap;
    while (p->urmator != NULL) {
        p = p->urmator;
    }
    p->urmator = n;
    return cap;
}

struct nod *scoate_valoare(struct nod *cap, int valoare) {
    struct nod *anterior = NULL;
    struct nod *p = cap;
    while (p != NULL && p->valoare != valoare) {
        anterior = p;
        p = p->urmator;
    }
    if (p == NULL) {
        return cap;
    }
    if (anterior == NULL) {
        cap = p->urmator;
    } else {
        anterior->urmator = p->urmator;
    }
    free(p);
    return cap;
}

int main(void) {
    struct nod *cap = NULL;
    cap = adauga_la_final(cap, 3);
    cap = adauga_la_final(cap, 7);
    cap = adauga_la_final(cap, 9);
    cap = scoate_valoare(cap, 3);
    cap = scoate_valoare(cap, 9);

    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        printf("%d\n", p->valoare);
    }

    while (cap != NULL) {
        struct nod *urmator = cap->urmator;
        free(cap);
        cap = urmator;
    }
    return 0;
}
```

Ieșire

```text
7
```

---

## Misiune: Coada de tipărire

Imprimanta de linii tipărește lucrările în ordinea în care sosesc. Uneori un operator se răzgândește și anulează o lucrare care încă așteaptă. Ține coada de tipărire într-o listă înlănțuită

1. Scrie **struct nod \*adauga_la_final(struct nod \*cap, int id)** care adaugă o lucrare la final și întoarce capul
2. Scrie **struct nod \*anuleaza(struct nod \*cap, int id)** care scoate din listă prima lucrare cu acel id, o eliberează și întoarce capul
3. Citește comenzi, câte una pe linie, până se termină datele, și răspunde la ele
   - `add id`: adaugă lucrarea la finalul cozii. Nu afișa nimic
   - `cancel id`: scoate lucrarea. Dacă nicio lucrare nu are acel id, afișează `Nicio lucrare ` și id-ul
   - `show`: afișează `Coada:` și id-urile în ordine, fiecare după un spațiu, sau `Coada: goala`
4. Eliberează la final fiecare nod rămas în listă

Id-urile sunt numere întregi de la 1 la 9999. Același id poate fi în coadă de mai multe ori. Sunt cel mult 500 de comenzi

**Exemplu**

Intrare

```text
add 12
add 40
add 7
cancel 40
cancel 99
show
cancel 12
cancel 7
show
```

Ieșire

```text
Nicio lucrare 99
Coada: 12 7
Coada: goala
```
