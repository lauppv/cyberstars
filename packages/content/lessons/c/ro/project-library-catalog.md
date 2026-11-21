Un proiect care folosește partea de C a cursului: struct-uri, o listă înlănțuită, qsort cu o funcție de comparare, șiruri și fișiere. Vei construi catalogul bibliotecii de benzi a centrului de calcul, raftul cu manuale și rapoarte pe care operatorii le împrumută

Aici nu e cod de copiat, doar un plan. Ia-o câte o comandă pe rând și testeaz-o pe fiecare înainte de următoarea

---

**Planul**

Fiecare carte e un nod al unei liste înlănțuite

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct carte {
    int id;
    char titlu[32];
    int an;
    int imprumutata;
    struct carte *urmator;
};

int main(void) {
    struct carte *b = malloc(sizeof(struct carte));
    b->id = 7;
    strcpy(b->titlu, "PayrollManual");
    b->an = 1969;
    b->imprumutata = 0;
    b->urmator = NULL;

    printf("%d %s %d %d\n", b->id, b->titlu, b->an, b->imprumutata);
    free(b);
    return 0;
}
```

Ieșire

```text
7 PayrollManual 1969 0
```

imprumutata e 1 cât timp cineva a împrumutat cartea. O să-ți trebuiască câteva funcții mici

- **gaseste**: parcurge lista și întoarce nodul cu un id, sau NULL
- **adauga**: fă un nod cu malloc și pune-l în față sau la final
- **scoate**: scoate un nod și eliberează-l, ca în lecțiile despre liste înlănțuite
- **goleste**: eliberează fiecare nod

---

list are nevoie de cărțile sortate, dar lista însăși poate rămâne în orice ordine. Construiește un array de pointeri la noduri, sortează acel array cu qsort și afișează din el. Funcția de comparare primește pointeri la căsuțele array-ului, iar fiecare căsuță e un `struct carte *`, deci e un pointer la pointer

```text
int dupa_an(const void *a, const void *b) {
    const struct carte *x = *(struct carte *const *)a;
    const struct carte *y = *(struct carte *const *)b;
    // compară x->an, apoi x->titlu, apoi x->id
}
```

---

save și load țin catalogul într-un fișier text, câte o carte pe linie, cu fprintf și fscanf din lecția despre fișiere. load înlocuiește tot catalogul cu ce e în fișier: golește întâi lista

---

## Misiune: Catalogul bibliotecii

1. Citește comenzi, câte una pe linie, până se termină datele, și răspunde la ele
   - `add id titlu an`: adaugă o carte. Dacă id-ul e luat, afișează `Cartea id exista deja`
   - `remove id`: scoate cartea. Dacă nu există o astfel de carte, afișează `Nu exista cartea id`
   - `borrow id`: marcheaz-o ca împrumutată. Afișează `Nu exista cartea id` sau `Cartea id e deja imprumutata`
   - `return id`: marcheaz-o ca adusă înapoi. Afișează `Nu exista cartea id` sau `Cartea id nu e imprumutata`
   - `list`: afișează fiecare carte ca `id an titlu`, cu ` (imprumutata)` după cele împrumutate, sortate după an, apoi după titlu, apoi după id. Afișează `Catalog gol` când nu e nicio carte
   - `save fisier`: scrie catalogul în fișier
   - `load fisier`: înlocuiește catalogul cu cel din fișier. Dacă fișierul nu poate fi deschis, afișează `Nu pot deschide ` și numele fișierului și păstrează catalogul
2. Ține cărțile într-o listă înlănțuită și sortează cu qsort pentru list
3. Eliberează fiecare nod înainte să se termine programul

Titlurile sunt un cuvânt de cel mult 30 de caractere. Id-urile sunt între 1 și 9999, anii între 1900 și 2099. Sunt cel mult 300 de comenzi

**Exemplu**

Intrare

```text
add 7 PayrollManual 1969
add 3 OrbitTables 1962
add 9 CensusReport 1969
add 3 Duplicate 1970
borrow 9
borrow 9
save shelf.txt
remove 7
list
load shelf.txt
return 3
list
```

Ieșire

```text
Cartea 3 exista deja
Cartea 9 e deja imprumutata
3 1962 OrbitTables
9 1969 CensusReport (imprumutata)
Cartea 3 nu e imprumutata
3 1962 OrbitTables
9 1969 CensusReport (imprumutata)
7 1969 PayrollManual
```

Fișierul ține minte ce cărți sunt împrumutate, deci după load cartea 9 e tot împrumutată
