Când transmitem un struct unei funcții, C copiază **întregul struct**. Pentru un struct mic e în regulă. Dar pentru un struct cu un buffer de 1000 de caractere și zeci de câmpuri, copierea e o risipă. Soluția: **transmite un pointer la struct**

```c
#include <stdio.h>
#include <string.h>

struct Terminal {
    char id[50];
    int sesiuni;
    int erori;
};

void afiseaza_terminal(struct Terminal *p) {
    printf("%s: %d sesiuni, %d erori\n", (*p).id, (*p).sesiuni, (*p).erori);
}

int main(void) {
    struct Terminal t = {"tty7", 3, 0};
    afiseaza_terminal(&t);
    return 0;
}
```

Transmitem **&t** (adresa struct-ului), iar funcția primește un **struct Terminal \***. Pentru a accesa câmpurile printr-un pointer, scriem **(\*p).sesiuni** — întâi dereferențiem, apoi accesăm câmpul

---

Să scrii **(\*p).sesiuni** peste tot e urât. C ne oferă o scurtătură: **operatorul săgeată ->**

```c
#include <stdio.h>

struct Terminal {
    char id[50];
    int sesiuni;
    int erori;
};

void afiseaza_terminal(struct Terminal *p) {
    printf("%s: %d sesiuni, %d erori\n", p->id, p->sesiuni, p->erori);
}

int main(void) {
    struct Terminal t = {"tty7", 3, 0};
    afiseaza_terminal(&t);
    return 0;
}
```

**p->sesiuni** este exact același lucru cu **(\*p).sesiuni**. E mai curat și toată lumea îl folosește. Regula e simplă: **punct** pentru struct-uri, **săgeată** pentru pointeri la struct-uri

---

Adevărata putere: funcții care **modifică** un struct printr-un pointer

```c
#include <stdio.h>

struct Terminal {
    char id[50];
    int sesiuni;
    int erori;
};

void inregistreaza_eroare(struct Terminal *p) {
    p->erori += 1;
    if (p->erori >= 3) {
        p->sesiuni = 0;
    }
}

void deschide_sesiune(struct Terminal *p) {
    p->sesiuni += 1;
}

int main(void) {
    struct Terminal t = {"tty7", 0, 0};
    deschide_sesiune(&t);
    deschide_sesiune(&t);
    inregistreaza_eroare(&t);
    printf("%s: %d sesiuni, %d erori\n", t.id, t.sesiuni, t.erori);
    return 0;
}
```

Output: **tty7: 2 sesiuni, 1 erori**

Funcțiile au modificat **struct-ul original**, nu o copie. Este același tipar de "pass by reference" pe care l-am învățat cu pointerii la int, dar acum cu struct-uri. Așa își gestionează programele C reale starea

---

## Misiune: Registrul de Cont pentru Timp de Calcul

Centrul de calcul facturează timpul de procesor pe ore. Fiecare utilizator are un cont cu un sold de ore, iar operatorii de tură fac alocări și retrageri de-a lungul zilei. Toate actualizările trebuie să treacă printr-un pointer, ca soldul original din registru să se schimbe pe loc.

1. Definește un struct **ContOre** cu câmpurile **proprietar** (array de char) și **sold** (int)
2. Scrie funcția **void aloca(struct ContOre \*cont, int ore)** — adaugă ore la sold prin pointer
3. Scrie funcția **void retrage(struct ContOre \*cont, int ore)** — scade ore din sold dacă e suficient, altfel afișează **"Fonduri insuficiente"**
4. Citește din input: numele proprietarului, soldul inițial, apoi trei operații. Fiecare operație are un cod (**1** = alocă, **2** = retrage) urmat de o valoare
5. După toate operațiile, afișează **"Sold: X"**

**Exemplu**

Intrare

```text
op7
1000
1 500
2 200
2 2000
```

Ieșire

```text
Fonduri insuficiente
Sold: 1300
```

**Exemplu**

Intrare

```text
op12
200
2 50
1 100
2 300
```

Ieșire

```text
Fonduri insuficiente
Sold: 250
```
