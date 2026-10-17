Lecția trecută ai construit un arbore de mână și i-ai citit nodurile câte un drum o dată: **radacina->stanga->dreapta**. Merge pentru cinci noduri. Un arbore adevărat poate avea mii, iar forma lui nu o știi dinainte. Ai nevoie de un fel de a vizita fiecare nod, oricum ar arăta arborele, cu câteva linii de cod

Felul acesta este **recursivitatea**, iar ea are nevoie mai întâi de o scurtă prezentare

---

O funcție poate apela orice funcție, inclusiv pe ea însăși. O funcție care se apelează pe ea însăși este **recursivă**

```c
#include <stdio.h>

void numaratoare(int n) {
    if (n == 0) {
        printf("Start!\n");
        return;
    }
    printf("%d\n", n);
    numaratoare(n - 1);
}

int main(void) {
    numaratoare(3);
    return 0;
}
```

Rezultat

```text
3
2
1
Start!
```

**numaratoare(3)** afișează 3 și lasă restul treburii lui **numaratoare(2)**, care afișează 2 și o lasă lui **numaratoare(1)**, și tot așa până la **numaratoare(0)**. Aceasta nu mai apelează nimic: afișează **Start!** și se întoarce

```text
numaratoare(3)    afiseaza 3, apeleaza numaratoare(2)
numaratoare(2)    afiseaza 2, apeleaza numaratoare(1)
numaratoare(1)    afiseaza 1, apeleaza numaratoare(0)
numaratoare(0)    afiseaza Start!, se intoarce
```

Fiecare apel lucrează pe o bucată mai mică a problemei, până când bucata e atât de mică încât răspunsul e evident. Cazul acela de la capăt este **cazul de bază**, și el e **if**-ul din vârful funcției: acolo funcția se oprește din a se mai apela

---

O funcție recursivă poate întoarce o valoare, construită din ce a întors apelul mai mic. Suma 1 + 2 + ... + n este n plus suma până la n - 1, iar suma până la 0 este 0

```c
#include <stdio.h>

int suma_pana_la(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma_pana_la(n - 1);
}

int main(void) {
    printf("%d\n", suma_pana_la(4));
    return 0;
}
```

Rezultat **10**

Apelurile coboară până la cazul de bază, apoi răspunsurile urcă înapoi, fiecare terminând adunarea pe care o aștepta

```text
suma_pana_la(4) = 4 + suma_pana_la(3)
suma_pana_la(3) = 3 + suma_pana_la(2)
suma_pana_la(2) = 2 + suma_pana_la(1)
suma_pana_la(1) = 1 + suma_pana_la(0)
suma_pana_la(0) = 0                       cazul de baza

apoi inapoi in sus: 1 + 0 = 1, 2 + 1 = 3, 3 + 3 = 6, 4 + 6 = 10
```

Fiecare apel care așteaptă un răspuns își păstrează propriul **n**, în locul lui din memorie, pe **stiva de apeluri**. Uită cazul de bază și apelurile nu se mai opresc: fiecare ia încă puțină stivă, până când ea se termină și programul se prăbușește, de obicei cu **Segmentation fault**. Orice funcție recursivă are nevoie de un caz de bază la care să ajungă sigur

---

Acum privește din nou un arbore

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Acoperă rădăcina cu mâna. Ce rămâne sunt doi arbori mai mici: unul care pornește de la **3**, unul care pornește de la **10**. Fiecare dintre ei este o rădăcină cu doi arbori mai mici sub ea, și tot așa, până la frunze

```text
      3        10
     / \         \
    1   6         14
```

Deci un arbore este o rădăcină plus doi arbori mai mici. Exact forma care îi place recursivității: ca să faci ceva cu un arbore, fă-l cu rădăcina și lasă aceeași funcție să se ocupe de cei doi arbori mai mici. Cazul de bază este arborele gol, **NULL**: acolo nu e nimic de făcut

---

Iată toată ideea. **afiseaza** afișează fiecare valoare din arbore

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

void afiseaza(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    printf("%d\n", nod->valoare);
    afiseaza(nod->stanga);
    afiseaza(nod->dreapta);
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    afiseaza(radacina);

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
8
3
1
6
10
14
```

**afiseaza(radacina)** afișează 8, apoi apelează **afiseaza** pe copilul stâng, care afișează 3 și coboară din nou. Când ajunge la un copil care lipsește, **nod == NULL** îl trimite direct înapoi în sus, iar plimbarea continuă de unde rămăsese. Nimic din **afiseaza** nu știe cât de mare e arborele: aceleași câteva linii merg pentru orice arbore

Cele șase linii cu **free** de la final nu au norocul ăsta: se potrivesc doar acestui arbore. Și asta o rezolvă recursivitatea, puțin mai jos

---

**afiseaza** a făcut trei lucruri la fiecare nod: a afișat nodul, a parcurs partea stângă, a parcurs partea dreaptă. Schimbă ordinea celor trei linii și obții altă parcurgere. Fiecare ordine are un nume, iar împreună sunt **parcurgerile în adâncime**: fiecare coboară până jos pe o parte înainte să se întoarcă după cealaltă

**Preordine:** întâi nodul, apoi partea lui stângă, apoi partea lui dreaptă

```text
void preordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    printf("%d ", nod->valoare);
    preordine(nod->stanga);
    preordine(nod->dreapta);
}
```

E parcurgerea pe care a făcut-o **afiseaza**. Numerele din paranteze dau ordinea în care e afișat fiecare nod

```text
          8 (1)
         / \
    (2) 3   10 (5)
       / \    \
  (3) 1   6    14 (6)
         (4)

Preordine: 8 3 1 6 10 14
```

**Inordine:** întâi partea stângă, apoi nodul, apoi partea dreaptă

```text
void inordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    inordine(nod->stanga);
    printf("%d ", nod->valoare);
    inordine(nod->dreapta);
}
```

```text
          8 (4)
         / \
    (2) 3   10 (5)
       / \    \
  (1) 1   6    14 (6)
         (3)

Inordine: 1 3 6 8 10 14
```

Uită-te la linia asta: numerele au ieșit sortate. Aici nu e o întâmplare, iar lecția despre arborii binari de căutare îți va arăta de ce

**Postordine:** partea stângă, apoi partea dreaptă, și nodul la final

```text
void postordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    postordine(nod->stanga);
    postordine(nod->dreapta);
    printf("%d ", nod->valoare);
}
```

```text
          8 (6)
         / \
    (3) 3   10 (5)
       / \    \
  (1) 1   6    14 (4)
         (2)

Postordine: 1 6 3 14 10 8
```

Un nod e afișat abia după tot ce se află sub el. E ordinea de folosit când copiii trebuie rezolvați înaintea părintelui, iar în C știi deja o astfel de treabă: eliberarea. Un nod nu poate fi eliberat înaintea copiilor lui, altfel pointerii lui către ei nu mai pot fi citiți. O parcurgere în postordine care eliberează în loc să afișeze eliberează orice arbore, oricât de mare

```text
void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}
```

De aici înainte, **elibereaza_arbore(radacina)** ține locul listei de linii cu **free**

---

Toate trei pe același arbore. **printf("%d ", ...)** ține valorile pe o singură linie, iar **printf("\n")** o încheie

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

void preordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    printf("%d ", nod->valoare);
    preordine(nod->stanga);
    preordine(nod->dreapta);
}

void inordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    inordine(nod->stanga);
    printf("%d ", nod->valoare);
    inordine(nod->dreapta);
}

void postordine(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    postordine(nod->stanga);
    postordine(nod->dreapta);
    printf("%d ", nod->valoare);
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    preordine(radacina);
    printf("\n");
    inordine(radacina);
    printf("\n");
    postordine(radacina);
    printf("\n");

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat

```text
8 3 1 6 10 14
1 3 6 8 10 14
1 6 3 14 10 8
```

---

O funcție recursivă poate și să **întoarcă** ceva despre arbore. **Înălțimea** este numărul de muchii de pe cel mai lung drum în jos de la rădăcină. Gândește recursiv: arborele este rădăcina deasupra celor doi arbori mai mici, deci înălțimea lui este cu o muchie mai mare decât a celui mai înalt dintre cei doi

```text
inaltime(8) = 1 + cea mai mare dintre inaltime(3) si inaltime(10)
```

Cazul de bază cere atenție. O singură frunză are înălțimea 0 și se află cu o muchie deasupra celor doi copii lipsă. Așa că un arbore gol contează ca **-1**: atunci o frunză primește 1 + (-1) = 0, cum trebuie

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

int inaltime(struct Nod *nod) {
    if (nod == NULL) {
        return -1;
    }
    int stanga = inaltime(nod->stanga);
    int dreapta = inaltime(nod->dreapta);
    if (stanga > dreapta) {
        return 1 + stanga;
    }
    return 1 + dreapta;
}

void elibereaza_arbore(struct Nod *nod) {
    if (nod == NULL) {
        return;
    }
    elibereaza_arbore(nod->stanga);
    elibereaza_arbore(nod->dreapta);
    free(nod);
}

int main(void) {
    struct Nod *radacina = nod_nou(8);
    radacina->stanga = nod_nou(3);
    radacina->dreapta = nod_nou(10);
    radacina->stanga->stanga = nod_nou(1);
    radacina->stanga->dreapta = nod_nou(6);
    radacina->dreapta->dreapta = nod_nou(14);

    printf("%d\n", inaltime(radacina));
    printf("%d\n", inaltime(radacina->dreapta));
    printf("%d\n", inaltime(radacina->stanga->stanga));

    elibereaza_arbore(radacina);
    return 0;
}
```

Rezultat

```text
2
1
0
```

Urmărește-o de jos în sus, cu răspunsul fiecărui nod în paranteze. Fiecare frunză răspunde 0. **10** răspunde 1 + cea mai mare dintre -1 și 0, deci 1, la fel și **3**. Rădăcina răspunde 1 + cea mai mare dintre 1 și 1: **2**

```text
          8 (2)
         / \
    (1) 3   10 (1)
       / \    \
  (0) 1   6    14 (0)
         (0)
```

---

Același tipar numără nodurile, adună valorile sau o găsește pe cea mai mare. Hotărăște ce răspunde arborele gol, apoi construiește răspunsul unui nod din răspunsurile celor doi copii

```text
int numara(struct Nod *nod) {
    if (nod == NULL) {
        return 0;
    }
    return 1 + numara(nod->stanga) + numara(nod->dreapta);
}
```

---

## Misiune: Parcurge un arbore

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     / \   \
    d   e   f
       /
      g
```

1. Scrie structura **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele șapte valori, câte o variabilă `int` pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Scrie câte o funcție recursivă pentru fiecare dintre cele trei parcurgeri în adâncime și folosește-le ca să afișezi trei linii
   - **Preordine:** și valorile în preordine
   - **Inordine:** și valorile în inordine
   - **Postordine:** și valorile în postordine
5. Eliberează fiecare nod înainte ca **main** să se termine

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Preordine: 1 2 4 5 7 3 6
Inordine: 4 2 7 5 1 3 6
Postordine: 4 7 5 2 6 3 1
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20, e = 40, f = 80 și g = 35

```text
Preordine: 50 30 20 40 35 70 80
Inordine: 20 30 35 40 50 70 80
Postordine: 20 35 40 30 80 70 50
```
