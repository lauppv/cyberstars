Listele țin lucrurile în șir: un prim element, un al doilea, un al treilea. Multe din ce întâlnești zi de zi se ramifică însă. Folderele de pe calculator conțin alte foldere, care conțin la rândul lor foldere. Un arbore genealogic se desparte la fiecare generație. Tabloul unui turneu se strânge până la un singur câștigător. Toate au aceeași formă, și ea are un nume: **arbore**

---

Iată un arbore mic de numere

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Fiecare număr este un **nod**, iar fiecare linie dintre două noduri este o **muchie**. În programare arborii cresc cu capul în jos: încep de sus

- **Rădăcina** este nodul de sus, de unde pornește arborele: **8**
- Un nod aflat imediat sub altul este **copilul** lui, iar cel de deasupra este **părintele** lui. **3** și **10** sunt copiii lui **8**, iar **8** este părintele lor
- Un nod fără copii este o **frunză**: **1**, **6** și **14**
- **Înălțimea** unui arbore este numărul de muchii de pe cel mai lung drum de la rădăcină în jos până la o frunză. Aici e 8 → 3 → 1 sau 8 → 10 → 14: două muchii, deci înălțimea este **2**. Un arbore care are doar rădăcina are înălțimea **0**

Fiecare nod în afară de rădăcină are exact un părinte, deci există un singur drum de la rădăcină în jos până la fiecare nod. Asta îl face arbore, și nu doar un ghem de linii

---

În acest arbore niciun nod nu are mai mult de doi copii. Un astfel de arbore este un **arbore binar**, iar cei doi copii au nume: copilul **stâng** și copilul **drept**. **10** are doar un copil drept, **14**; cel stâng lipsește

Arborii binari sunt cei pe care îi vei folosi cel mai des. Căutarea, sortarea și majoritatea problemelor din lecțiile următoare pornesc de la ei

---

Un nod trebuie să țină împreună trei lucruri: **valoarea** lui, copilul **stâng** și copilul **drept**. În C asta e o structură ai cărei copii sunt **pointeri** către alte noduri

```text
struct Nod {
    int valoare;
    struct Nod *stanga;
    struct Nod *dreapta;
};
```

Un pointer care nu arată spre nimic este **NULL**: un nod al cărui **stanga** e NULL nu are copil stâng

Fiecare nod își primește memoria de la **malloc**, deci trăiește până îl eliberezi cu **free**. O funcție mică face unul, încă fără copii

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

int main(void) {
    struct Nod *radacina = nod_nou(8);
    printf("%d\n", radacina->valoare);
    if (radacina->stanga == NULL) {
        printf("niciun copil stang\n");
    } else {
        printf("un copil stang\n");
    }
    free(radacina);
    return 0;
}
```

Rezultat

```text
8
niciun copil stang
```

Singur, un nod nou este o valoare cu doi copii goi

```text
      8
     / \
  NULL NULL
```

---

Un copil e doar un alt nod, a cărui adresă intră în **stanga** sau în **dreapta**. Iată cum crește arborele de la începutul lecției, câte o linie de cod

```text
struct Nod *radacina = nod_nou(8);

        8

radacina->stanga = nod_nou(3);

        8
       /
      3

radacina->dreapta = nod_nou(10);

        8
       / \
      3   10

radacina->stanga->stanga = nod_nou(1);

        8
       / \
      3   10
     /
    1

radacina->stanga->dreapta = nod_nou(6);

        8
       / \
      3   10
     / \
    1   6

radacina->dreapta->dreapta = nod_nou(14);

        8
       / \
      3   10
     / \    \
    1   6    14
```

Toate la un loc, cu trei dintre noduri citite înapoi

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

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    printf("%d\n", radacina->stanga->valoare);
    printf("%d\n", radacina->stanga->dreapta->valoare);
    printf("%d\n", radacina->dreapta->dreapta->valoare);

    free(radacina->stanga->stanga);
    free(radacina->stanga->dreapta);
    free(radacina->dreapta->dreapta);
    free(radacina->stanga);
    free(radacina->dreapta);
    free(radacina);
    return 0;
}
```

Rezultat

```text
3
6
14
```

**->** citește un câmp printr-un pointer, deci **radacina->stanga->dreapta** merge câte un pas: pornești de la rădăcină, mergi la copilul ei stâng, apoi la copilul drept al acestuia. Orice nod poate fi atins așa, de la rădăcină în jos pe muchii. Programul ține într-o variabilă doar **radacina**; toate celelalte noduri atârnă de ea

Adică drumul acesta prin arbore

```text
        8          radacina
       /
      3            radacina->stanga
       \
        6          radacina->stanga->dreapta
```

Fiecare **malloc** își are **free**-ul lui, copiii înaintea părintelui: după ce părintele e eliberat, pointerii lui către ei nu mai pot fi citiți

---

O frunză este un nod ai cărui doi copii sunt amândoi **NULL**

În arborele de la început, frunzele sunt cele trei noduri din paranteze

```text
        8
       / \
      3   10
     / \    \
   (1) (6)  (14)
```

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

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    struct Nod *frunza = radacina->stanga->stanga;
    if (frunza->stanga == NULL && frunza->dreapta == NULL) {
        printf("%d este o frunza\n", frunza->valoare);
    }

    free(radacina->stanga->stanga);
    free(radacina->stanga->dreapta);
    free(radacina->dreapta->dreapta);
    free(radacina->stanga);
    free(radacina->dreapta);
    free(radacina);
    return 0;
}
```

Rezultat **1 este o frunza**

---

Deocamdată construiești arborii de mână, câte un nod. În lecțiile următoare vei parcurge un arbore întreg cu câteva linii de cod, oricât de mare ar fi

---

## Misiune: Construiește un arbore

Iată un arbore binar cu cinci noduri, cu o literă în locul fiecărei valori

```text
      a
     / \
    b   c
   / \
  d   e
```

1. Scrie structura **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele cinci valori, câte o variabilă pentru fiecare literă: `int a = 8;`, `int b = 3;`, `int c = 10;`, `int d = 1;` și `int e = 6;`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Apoi, pornind de la rădăcină și mergând prin copiii ei, afișează trei linii
   - **Radacina:** și valoarea rădăcinii
   - **Copii:** și copiii rădăcinii, întâi cel stâng
   - **Frunze:** și frunzele, de la stânga la dreapta
5. Eliberează fiecare nod înainte ca **main** să se termine

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 8, b = 3, c = 10, d = 1 și e = 6

```text
Radacina: 8
Copii: 3 10
Frunze: 1 6 10
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20 și e = 40

```text
Radacina: 50
Copii: 30 70
Frunze: 20 40 70
```
