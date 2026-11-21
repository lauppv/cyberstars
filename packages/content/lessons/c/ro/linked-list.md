Un array își ține valorile una lângă alta, într-un singur bloc de memorie. Ca să-l mărim, avem nevoie de realloc, iar ca să punem o valoare la mijloc, trebuie să mutăm tot ce e după ea

O **listă înlănțuită** ține fiecare valoare în blocul ei mic, numit **nod**. Fiecare nod mai ține și un pointer spre nodul următor. Nodurile pot sta oriunde în memorie: pointerii le țin legate, ca un lanț

```text
cap -> [ 3 | * ] -> [ 7 | * ] -> [ 9 | * ] -> NULL
```

---

Un nod e un struct cu o valoare și un pointer spre nodul următor, care e un struct de același fel

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

Un struct nu poate ține în el un alt struct întreg de același tip, nu s-ar mai termina. Dar poate ține un pointer spre unul, și asta e tot ce ne trebuie. Câmpul urmator al ultimului nod e NULL: așa știm că lanțul se termină acolo

---

Facem noduri cu malloc și le legăm prin pointerii urmator. Ca să parcurgem lista, pornim de la primul nod, **capul** (head), și mergem pe urmator până ajungem la NULL

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

int main(void) {
    struct nod *c = malloc(sizeof(struct nod));
    c->valoare = 9;
    c->urmator = NULL;

    struct nod *b = malloc(sizeof(struct nod));
    b->valoare = 7;
    b->urmator = c;

    struct nod *cap = malloc(sizeof(struct nod));
    cap->valoare = 3;
    cap->urmator = b;

    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        printf("%d\n", p->valoare);
    }

    free(cap);
    free(b);
    free(c);
    return 0;
}
```

Ieșire

```text
3
7
9
```

`p = p->urmator` e pasul care ne mută de-a lungul lanțului, ca `i++` într-o buclă pe array

---

Adăugarea unei valori în față e rapidă, oricât de lungă ar fi lista: facem un nod, îi legăm urmator de capul vechi, iar nodul nou devine capul

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = cap;
    return n;
}

int main(void) {
    struct nod *cap = NULL;
    cap = adauga(cap, 9);
    cap = adauga(cap, 7);
    cap = adauga(cap, 3);
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

Funcția întoarce capul nou, deci o apelăm așa: `cap = adauga(cap, 5);`. O listă goală e pur și simplu `struct nod *cap = NULL;`, iar adauga merge și pe ea

---

Când am terminat, fiecare nod trebuie eliberat. Dar atenție: după `free(p)` nu mai avem voie să citim `p->urmator`. Așa că întâi salvăm nodul următor

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = cap;
    return n;
}

int main(void) {
    struct nod *cap = NULL;
    for (int i = 1; i <= 3; i++) {
        cap = adauga(cap, i);
    }

    int eliberate = 0;
    while (cap != NULL) {
        struct nod *urmator = cap->urmator;
        free(cap);
        cap = urmator;
        eliberate++;
    }
    printf("am eliberat %d noduri\n", eliberate);
    return 0;
}
```

Ieșire

```text
am eliberat 3 noduri
```

---

## Misiune: Lanțul de lucrări

Mainframe-ul își ține lucrările care așteaptă într-un lanț. Lucrările noi sunt puse mereu în față, deci cea mai nouă lucrare e prima. Operatorul vrea să vadă tot lanțul, cât de lung e și de câte minute au nevoie lucrările împreună

1. Scrie o funcție **struct nod \*adauga(struct nod \*cap, int valoare)** care adaugă un nod în fața listei și întoarce capul nou
2. Citește numere întregi până se termină datele: minutele fiecărei lucrări. Adaugă-le pe fiecare în listă
3. Parcurge lista și afișeaz-o ca în exemplu, cu `->` între valori și `NULL` la final
4. Parcurge-o din nou ca să numeri nodurile și să aduni valorile lor, apoi afișează-le pe amândouă
5. Eliberează fiecare nod la final

Există cel puțin o lucrare și cel mult 1000. Fiecare are nevoie de 1 până la 500 de minute

**Exemplu**

Intrare

```text
7 3 9
```

Ieșire

```text
9 -> 3 -> 7 -> NULL
Lungime: 3
Total: 19
```
