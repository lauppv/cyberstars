Uneori avem o variabilă care poate avea doar una dintre câteva **valori cu nume**: o zi a săptămânii, o direcție, o stare de joc. Am putea folosi int-uri (0 = SUS, 1 = JOS...) dar e ilizibil. **Enum-urile** dau nume acestor constante

```c
#include <stdio.h>

enum Directie { SUS, JOS, STANGA, DREAPTA };

int main(void) {
    enum Directie d = SUS;

    if (d == SUS) {
        printf("Merg in sus!\n");
    }
    return 0;
}
```

În culise, **SUS** este **0**, **JOS** este **1**, **STANGA** este **2**, **DREAPTA** este **3**. Compilatorul atribuie automat numere începând de la 0. Dar noi scriem **SUS** în loc de **0**, ceea ce face codul mult mai clar

---

Putem alege propriile noastre valori dacă vrem

```c
#include <stdio.h>

enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};

int main(void) {
    enum HttpStatus cod = NOT_FOUND;
    printf("Status: %d\n", cod);   // Status: 404
    return 0;
}
```

---

Enum-urile funcționează grozav cu **switch**

```c
#include <stdio.h>

enum Culoare { ROSU, VERDE, ALBASTRU };

void afiseaza_culoare(enum Culoare c) {
    switch (c) {
        case ROSU:     printf("Rosu\n");     break;
        case VERDE:    printf("Verde\n");    break;
        case ALBASTRU: printf("Albastru\n"); break;
    }
}

int main(void) {
    afiseaza_culoare(ROSU);
    afiseaza_culoare(VERDE);
    afiseaza_culoare(ALBASTRU);
    return 0;
}
```

Asta e mult mai bine decât `if (c == 0)` — oricine citește codul știe exact ce înseamnă ROSU

---

O folosință clasică: stările unui joc

```c
#include <stdio.h>

enum StareJoc { MENIU, IN_JOC, PAUZAT, GAME_OVER };

int main(void) {
    enum StareJoc stare = MENIU;
    // jucatorul apasa start
    stare = IN_JOC;
    // jucatorul apasa escape
    stare = PAUZAT;
    printf("%d\n", stare);
    return 0;
}
```

În loc să ținem minte "era 2 pauzat sau game over?", folosim pur și simplu numele. Codul se citește ca limba engleză

---

## Misiune: Modulul de Climă

Stația orbitează în jurul unei planete cu patru anotimpuri distincte. Modulul de climă are nevoie de o funcție care traduce fiecare cod de anotimp într-un nume citibil pentru afișajul echipajului.

**enum Anotimp** și scheletul funcției **afiseaza_anotimp** sunt deja în dreapta. Completează instrucțiunea **switch** astfel încât fiecare caz să afișeze numele anotimpului.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Primavara
Vara
Toamna
Iarna
```
