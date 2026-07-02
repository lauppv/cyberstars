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

enum CoduIesire {
    SUCCES = 0,
    EROARE_CITIRE = 1,
    EROARE_MEMORIE = 2
};

int main(void) {
    enum CoduIesire cod = EROARE_CITIRE;
    printf("Cod iesire: %d\n", cod);   // Cod iesire: 1
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

O folosință clasică: stările unui job din coada de procesare

```c
#include <stdio.h>

enum StareJob { COADA, RULEAZA, SUSPENDAT, TERMINAT };

int main(void) {
    enum StareJob stare = COADA;
    // operatorul porneste jobul
    stare = RULEAZA;
    // operatorul il suspenda pentru un job prioritar
    stare = SUSPENDAT;
    printf("%d\n", stare);
    return 0;
}
```

În loc să ținem minte "era 2 suspendat sau terminat?", folosim pur și simplu numele. Codul se citește aproape ca engleza obișnuită

---

## Misiune: Calendarul de Mentenanță

Centrul de calcul rulează un ciclu de mentenanță trimestrial, câte o rundă pentru fiecare anotimp. Consola de operare are nevoie de o funcție care traduce fiecare cod de anotimp într-un nume citibil pe ecranul teletype-ului.

1. Definește **enum Anotimp** cu valorile **PRIMAVARA**, **VARA**, **TOAMNA**, **IARNA**
2. Scrie funcția **void afiseaza_anotimp(enum Anotimp a)** cu o instrucțiune **switch** care afișează numele anotimpului
3. În **main**, apelează funcția pentru toate cele patru anotimpuri, în ordine

**Exemplu**

Programul tău ar trebui să afișeze

```text
Primavara
Vara
Toamna
Iarna
```
