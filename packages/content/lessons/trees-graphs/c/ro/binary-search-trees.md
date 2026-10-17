Ca să găsești o valoare într-un arbore din cele de până acum, trebuie să te uiți la fiecare nod: poate fi oriunde. Un **arbore binar de căutare** își ține valorile într-o ordine care îți spune încotro s-o iei, așa că o căutare sare peste părți întregi din arbore fără să se uite la ele

---

Regula e despre fiecare nod, nu doar despre rădăcină: tot ce e în partea lui **stângă** e **mai mic** decât el, și tot ce e în partea lui **dreaptă** e **mai mare**

Arborele din lecțiile trecute o respectă

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

- În stânga lui **8** sunt 3, 1 și 6, toate mai mici. În dreapta lui sunt 10 și 14, amândouă mai mari
- În stânga lui **3** e 1, mai mic. În dreapta lui e 6, mai mare, și totuși mai mic decât 8, pentru că stă în partea stângă a lui 8
- În dreapta lui **10** e 14, mai mare

De aceea parcurgerea în inordine l-a afișat sortat: inordinea afișează tot ce e mai mic decât un nod, apoi nodul, apoi tot ce e mai mare

În lecția asta valorile dintr-un arbore sunt toate diferite, așa că regula nu trebuie să spună niciodată unde merge o valoare egală

---

**Căutarea** urmează un singur drum în jos. La fiecare nod, compară valoarea pe care o cauți cu a nodului. Egale: ai găsit-o. Mai mică: nu poate fi decât în partea stângă. Mai mare: doar în partea dreaptă. Dacă drumul se termină, la **NULL**, valoarea nu e în arbore

Căutarea lui **6**

```visual
{"use": "bst-search-6"}
```

Căutarea lui **12**

```visual
{"use": "bst-search-12"}
```

Trei noduri privite, din șase. Fiecare pas în jos lasă în urmă o parte întreagă a arborelui

Ca funcție recursivă, sunt aceleași trei întrebări, plus cazul de bază pentru un drum care s-a terminat. Întoarce 1 pentru găsit și 0 pentru negăsit

```c
#include <stdio.h>
#include <stdlib.h>

struct Nod {
    int valoare;
    struct Nod *stanga;
    struct Nod *dreapta;
};

struct Nod *nod_nou(int valoare) {
    struct Nod *nod = malloc(sizeof(struct Nod));
    nod->valoare = valoare;
    nod->stanga = NULL;
    nod->dreapta = NULL;
    return nod;
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

int cauta(struct Nod *nod, int cautat) {
    if (nod == NULL) {
        return 0;
    }
    if (cautat == nod->valoare) {
        return 1;
    }
    if (cautat < nod->valoare) {
        return cauta(nod->stanga, cautat);
    }
    return cauta(nod->dreapta, cautat);
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    printf("%d\n", cauta(radacina, 6));
    printf("%d\n", cauta(radacina, 12));

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat

```text
1
0
```

---

**Inserarea** merge pe același drum pe care ar merge o căutare. Unde se termină drumul, la **NULL**, e exact locul unde trebuie valoarea nouă, deci acolo îi merge nodul

```text
struct Nod *insereaza(struct Nod *nod, int valoare) {
    if (nod == NULL) {
        return nod_nou(valoare);
    }
    if (valoare < nod->valoare) {
        nod->stanga = insereaza(nod->stanga, valoare);
    } else {
        nod->dreapta = insereaza(nod->dreapta, valoare);
    }
    return nod;
}
```

**insereaza** dă înapoi nodul pe care a fost apelată, cu valoarea nouă undeva sub el. Doar jos de tot, unde a fost apelată pe **NULL**, dă înapoi un nod nou-nouț, iar părintele de cu un nivel mai sus îl păstrează în **stanga** sau în **dreapta**

Un arbore gol este **NULL**, iar inserarea în el face rădăcina. Iată arborele din lecție crescând din valorile 8, 3, 10, 1, 6 și 14, inserate în ordinea asta

```visual
{"use": "bst-insert"}
```

Puse laolaltă, cu o parcurgere în inordine ca să-l citim înapoi

```c
#include <stdio.h>
#include <stdlib.h>

struct Nod {
    int valoare;
    struct Nod *stanga;
    struct Nod *dreapta;
};

struct Nod *nod_nou(int valoare) {
    struct Nod *nod = malloc(sizeof(struct Nod));
    nod->valoare = valoare;
    nod->stanga = NULL;
    nod->dreapta = NULL;
    return nod;
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

struct Nod *insereaza(struct Nod *nod, int valoare) {
    if (nod == NULL) {
        return nod_nou(valoare);
    }
    if (valoare < nod->valoare) {
        nod->stanga = insereaza(nod->stanga, valoare);
    } else {
        nod->dreapta = insereaza(nod->dreapta, valoare);
    }
    return nod;
}

void inordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    inordine(nod->stanga);
    printf("%d ", nod->valoare);
    inordine(nod->dreapta);
}

int main(void) {
    int valori[] = {8, 3, 10, 1, 6, 14};
    struct Nod *radacina = NULL;
    for (int i = 0; i < 6; i++) {
        radacina = insereaza(radacina, valori[i]);
    }

    inordine(radacina);
    printf("\n");

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat **1 3 6 8 10 14**

Valorile au intrat amestecate și au ieșit sortate. Un arbore binar de căutare e încă un fel de a sorta

---

Ordinea în care intră valorile hotărăște forma arborelui. Inserează aceleași cinci valori în două ordini

```text
3, 1, 4, 2, 5              1, 2, 3, 4, 5

      3                    1
     / \                    \
    1   4                    2
     \   \                    \
      2   5                    3
                                \
                                 4
                                  \
                                   5
```

În stânga, un arbore de înălțime 2. În dreapta, valorile sortate au făcut ca fiecare să fie mai mare decât cea dinainte, așa că fiecare a mers la dreapta, iar arborele e o linie de înălțime 4. O căutare a lui 5 acolo vizitează fiecare nod, deloc mai repede decât parcurgerea unui array

Înălțimea e cât costă o căutare: un nod privit pe fiecare nivel. Deci un arbore e rapid doar cât timp rămâne stufos și scund. Există arbori binari de căutare care se reechilibrează singuri pe măsură ce intră valorile, ca să nu devină niciodată o linie, precum arborii **AVL** și **roșu-negru**; ei se bazează pe tot ce e în lecția asta

---

## Misiune: Crește un arbore de căutare

1. Scrie structura **Nod**, cu o valoare, un copil stâng și un copil drept
2. Citește intrarea cu **scanf**: pe prima linie **n**, câte valori sunt, pe a doua linie cele **n** valori, iar pe a treia linie o valoare **căutată**
3. Pornind de la un arbore gol, inserează valorile într-un arbore binar de căutare una câte una, în ordinea în care au fost citite
4. Apoi, cu funcții recursive, afișează trei linii
   - **Sortat:** și valorile din arbore, dintr-o parcurgere în inordine
   - **Inaltime:** și înălțimea arborelui
   - **Cautare**, valoarea căutată, două puncte și **gasit** dacă valoarea e în arbore, sau **negasit** dacă nu e. Găsește-o căutând în arbore, nu în valorile citite
5. Eliberează fiecare nod înainte ca **main** să se termine

**n** este de la 1 la 7, valorile sunt toate diferite, iar fiecare număr, inclusiv cel căutat, este de la -1000 la 1000

**Exemplu**

Intrare

```text
7
50 30 70 20 40 60 80
60
```

Ieșire

```text
Sortat: 20 30 40 50 60 70 80
Inaltime: 2
Cautare 60: gasit
```

**Exemplu**

Intrare

```text
5
1 2 3 4 5
6
```

Ieșire

```text
Sortat: 1 2 3 4 5
Inaltime: 4
Cautare 6: negasit
```
