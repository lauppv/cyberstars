Parcurgerile în adâncime se scufundă: coboară până jos pe o parte a arborelui înainte să se întoarcă după cealaltă. Uneori vrei invers. Întâi rădăcina, apoi tot ce e cu un pas sub ea, apoi tot ce e cu doi pași sub ea, așa cum ai citi arborele pe hârtie, rând cu rând. Asta e o **parcurgere pe niveluri**

---

Nodurile unui arbore stau pe **niveluri**. Rădăcina e pe nivelul **0**, copiii ei pe nivelul **1**, copiii lor pe nivelul **2**, și tot așa

```text
        8            nivelul 0
       / \
      3   10         nivelul 1
     / \    \
    1   6    14      nivelul 2
```

O parcurgere pe niveluri le vizitează de sus în jos și, pe fiecare nivel, de la stânga la dreapta

```text
8 3 10 1 6 14
```

Numărul ultimului nivel este înălțimea arborelui: aici **2**, același răspuns pe care l-a dat **inaltime**, cea recursivă, lecția trecută

---

Recursivitatea nu se potrivește aici. Un apel recursiv pe copilul stâng termină toată partea stângă înainte să-i vină rândul copilului drept, așa că **1** și **6** ar ieși înaintea lui **10**. Altceva trebuie să țină minte ce noduri așteaptă și să le dea mai departe în ordinea în care au fost găsite

Acel ceva este o **coadă**, ca șirul de la casa de marcat. Cine vine se așază la capătul din spate, cine e servit pleacă din față: primul venit, primul servit

```text
vin:      Ana, apoi Ben, apoi Cris

fata [ Ana  Ben  Cris ] spate

servire:  Ana iese prima, apoi Ben
```

---

C nu are o coadă gata făcută, dar un array și doi indici fac una. **sfarsit** e locul unde intră următoarea valoare, **inceput** e locul de unde e servită următoarea. Amândoi pornesc de la 0 și fiecare merge doar înainte

```text
coada[sfarsit] = x; sfarsit++;      intra in spate
x = coada[inceput]; inceput++;      iese din fata
inceput < sfarsit                   coada nu e goala
```

```c
#include <stdio.h>

int main(void) {
    int coada[10];
    int inceput = 0;
    int sfarsit = 0;

    coada[sfarsit] = 5;
    sfarsit++;
    coada[sfarsit] = 7;
    sfarsit++;
    coada[sfarsit] = 9;
    sfarsit++;

    printf("%d\n", coada[inceput]);
    inceput++;
    printf("%d\n", coada[inceput]);
    inceput++;
    printf("%d\n", sfarsit - inceput);
    return 0;
}
```

Rezultat

```text
5
7
1
```

**sfarsit - inceput** e câte valori mai așteaptă. O valoare servită rămâne în array, dar **inceput** a trecut de ea, deci nu mai e în coadă. Cum fiecare valoare intră o singură dată și indicii nu se întorc niciodată, array-ul are nevoie de loc pentru fiecare valoare care va intra vreodată. Pentru un arbore, asta înseamnă un loc pentru fiecare nod

---

Acum parcurgerea propriu-zisă. Coada ține pointeri către noduri, `struct Nod *`. Pune rădăcina în ea. Apoi, cât timp coada nu e goală: ia nodul din față, afișează-l și pune-i copiii în spate

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

void parcurgere_pe_niveluri(struct Nod *radacina) {
    struct Nod *coada[100];
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit] = radacina;
    sfarsit++;
    while (inceput < sfarsit) {
        struct Nod *nod = coada[inceput];
        inceput++;
        printf("%d ", nod->valoare);
        if (nod->stanga != NULL) {
            coada[sfarsit] = nod->stanga;
            sfarsit++;
        }
        if (nod->dreapta != NULL) {
            coada[sfarsit] = nod->dreapta;
            sfarsit++;
        }
    }
    printf("\n");
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    parcurgere_pe_niveluri(radacina);

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat **8 3 10 1 6 14**

Coada are loc pentru 100 de noduri, mult mai mult decât îi trebuie arborelui ăstuia. Iată-o după ce fiecare nod e scos și copiii lui puși înăuntru, partea de la **inceput** la **sfarsit**. Copiii intră mereu în spatele tuturor celor care așteaptă deja, așa că un nivel întreg iese din coadă înainte să înceapă următorul

```text
scos   afisat  coada dupa
               [8]
8      8       [3, 10]
3      3       [10, 1, 6]
10     10      [1, 6, 14]
1      1       [6, 14]
6      6       [14]
14     14      []
```

Cele două linii cu **if** țin copiii lipsă departe de coadă: când copilul e **NULL**, nu există niciun nod de scos mai târziu

---

Ca să afișezi fiecare nivel pe linia lui, observă ce ține coada când începe un nivel: exact nodurile acelui nivel, și nimic altceva

```text
incepe nivelul 0    [8]
incepe nivelul 1    [3, 10]
incepe nivelul 2    [1, 6, 14]
```

Așa că numără-le întâi cu **sfarsit - inceput** și scoate exact atâtea. Copiii pe care îi pun ei înăuntru așteaptă runda următoare

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

void afiseaza_niveluri(struct Nod *radacina) {
    struct Nod *coada[100];
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit] = radacina;
    sfarsit++;
    int nivel = 0;
    while (inceput < sfarsit) {
        int marime = sfarsit - inceput;
        printf("Nivelul %d: ", nivel);
        for (int i = 0; i < marime; i++) {
            struct Nod *nod = coada[inceput];
            inceput++;
            printf("%d ", nod->valoare);
            if (nod->stanga != NULL) {
                coada[sfarsit] = nod->stanga;
                sfarsit++;
            }
            if (nod->dreapta != NULL) {
                coada[sfarsit] = nod->dreapta;
                sfarsit++;
            }
        }
        printf("\n");
        nivel++;
    }
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    afiseaza_niveluri(radacina);

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat

```text
Nivelul 0: 8
Nivelul 1: 3 10
Nivelul 2: 1 6 14
```

---

Mergând nivel cu nivel, parcurgerea ajunge la fiecare nod aproape de rădăcină înaintea oricărui nod mai îndepărtat. De aceea parcurgerea asta, numită în general **în lățime**, revine în lecțiile despre grafuri: găsește cel mai scurt drum dintr-un loc în altul

---

## Misiune: Citește un arbore pe niveluri

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     /   / \
    d   e   f
         \
          g
```

1. Scrie structura **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele șapte valori, câte o variabilă `int` pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Parcurge-l nivel cu nivel cu o coadă și afișează câte o linie pentru fiecare nivel: **Nivelul**, numărul nivelului, două puncte și valorile de pe acel nivel, de la stânga la dreapta
5. Eliberează fiecare nod înainte ca **main** să se termine

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Nivelul 0: 1
Nivelul 1: 2 3
Nivelul 2: 4 5 6
Nivelul 3: 7
```

**Exemplu** pentru a = 40, b = 20, c = 60, d = 10, e = 50, f = 70 și g = 55

```text
Nivelul 0: 40
Nivelul 1: 20 60
Nivelul 2: 10 50 70
Nivelul 3: 55
```
