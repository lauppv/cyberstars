Când transmitem un struct unei funcții, C copiază **întregul struct**. Pentru un struct mic e în regulă. Dar pentru un struct cu un nume de 1000 de caractere și zeci de câmpuri, copierea e o risipă. Soluția: **transmite un pointer la struct**

```c
#include <stdio.h>
#include <string.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

void afiseaza_jucator(struct Jucator *p) {
    printf("%s: %d HP, %d pts\n", (*p).nume, (*p).viata, (*p).scor);
}

int main(void) {
    struct Jucator t = {"Tommy", 100, 500};
    afiseaza_jucator(&t);
    return 0;
}
```

Transmitem **&t** (adresa struct-ului), iar funcția primește un **struct Jucator \***. Pentru a accesa câmpurile printr-un pointer, scriem **(\*p).viata** — întâi dereferențiem, apoi accesăm câmpul

---

Să scrii **(\*p).viata** peste tot e urât. C ne oferă o scurtătură: **operatorul săgeată ->**

```c
#include <stdio.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

void afiseaza_jucator(struct Jucator *p) {
    printf("%s: %d HP, %d pts\n", p->nume, p->viata, p->scor);
}

int main(void) {
    struct Jucator t = {"Tommy", 100, 500};
    afiseaza_jucator(&t);
    return 0;
}
```

**p->viata** este exact același lucru cu **(\*p).viata**. E mai curat și toată lumea îl folosește. Regula e simplă: **punct** pentru struct-uri, **săgeată** pentru pointeri la struct-uri

---

Adevărata putere: funcții care **modifică** un struct printr-un pointer

```c
#include <stdio.h>

struct Jucator {
    char nume[50];
    int viata;
    int scor;
};

void primeste_dauna(struct Jucator *p, int dmg) {
    p->viata -= dmg;
    if (p->viata < 0) {
        p->viata = 0;
    }
}

void adauga_scor(struct Jucator *p, int puncte) {
    p->scor += puncte;
}

int main(void) {
    struct Jucator t = {"Tommy", 100, 0};
    primeste_dauna(&t, 30);
    adauga_scor(&t, 200);
    printf("%s: %d HP, %d pts\n", t.nume, t.viata, t.scor);
    return 0;
}
```

Output: **Tommy: 70 HP, 200 pts**

Funcțiile au modificat **struct-ul original**, nu o copie. Este același tipar de "pass by reference" pe care l-am învățat cu pointerii la int, dar acum cu struct-uri. Așa își gestionează programele C reale starea

---

## Misiune: Sistemul de Credite al Stației

Modulul de trezorerie al stației are nevoie de două funcții esențiale: depunere și retragere. Conturile echipajului sunt stocate ca struct-uri, iar toate actualizările trec prin pointeri ca să se schimbe soldul original pe loc.

1. Struct-ul **ContBancar** (cu **proprietar** și **sold**) este deja definit în dreapta
2. Completează funcția **depune**: adaugă suma la sold prin pointer
3. Completează funcția **retrage**: scade suma dacă soldul e suficient, altfel afișează **"Fonduri insuficiente"**

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- Proprietar cont: **"Lance"**, sold inițial: **1000**
- Operațiuni: depune **500**, retrage **200**, retrage **2000**

**Exemplu**

Cu valorile de pornire, programul tău ar trebui să afișeze

```text
Fonduri insuficiente
Sold: 1300
```
