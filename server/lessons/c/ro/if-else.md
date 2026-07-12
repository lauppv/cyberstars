În viața reală luăm decizii: **dacă** e frig, iei un pulover, **altfel** un tricou este de ajuns. **Dacă** mi-e somn, dorm, **altfel** programez

În C spunem

```c
#include <stdio.h>

int main(void) {
    int varsta = 18;

    if (varsta < 18) {
        printf("Acces refuzat pentru ca nu ai 18 ani\n");
    } else {
        printf("Bun venit in club\n");
    }

    return 0;
}
```

Câteva reguli de sintaxă

- Condiția stă între **paranteze** **( )**
- Corpul stă între **acolade** **{ }**
- Nu există **:** la final

Dacă **varsta** este mai mică decât **18**, intrăm în blocul **if**. Altfel intrăm în **else**. Rulează codul, schimbă vârsta, vezi ce se întâmplă

---

Operatorii de comparație

- **<** mai mic decât
- **<=** mai mic sau egal
- **>** mai mare decât
- **>=** mai mare sau egal
- **==** egal (atenție la cele **două** semne egal)
- **!=** **diferit** de

**Fii foarte atent** la diferența dintre **=** și **==**. **=** atribuie, **==** compară

```c
#include <stdio.h>

int main(void) {
    int x = 4;
    if (x = 4) {
        printf("Boo\n");
    }
    return 0;
}
```

Acesta este un **bug clasic în C**: **C acceptă acest cod fără nicio eroare de compilare**. **x = 4** stochează **4** în **x** și returnează valoarea **4**, pe care C o tratează ca "adevărat" (orice valoare diferită de zero înseamnă adevărat). Așadar codul intră mereu în **if**, indiferent ce era **x** înainte. Multe bug-uri din proiecte reale, faimoase, vin exact din această greșeală de tastare. Folosește **==** când compari

---

Nu avem mereu nevoie de **else**. Uneori vrem doar să facem ceva **dacă** o condiție este adevărată, iar altfel să nu facem nimic

```c
#include <stdio.h>

int main(void) {
    int utilizator_online = 1;
    if (utilizator_online) {
        printf("Bine ai revenit\n");
    }
    return 0;
}
```

Stai, **utilizator_online = 1**? Unde este **true**? Ei bine, **C nu are un tip boolean adevărat implicit**. Folosește numere întregi: **0** înseamnă **fals**, **orice altceva** (1, 2, -5, ...) înseamnă **adevărat**. Vom vedea un tip **bool** adevărat într-o lecție viitoare, cu **#include <stdbool.h>**

---

Un exemplu complet

```c
#include <stdio.h>

int main(void) {
    int terminal_conectat = 1;

    if (terminal_conectat) {
        printf("Sesiune deschisa\n");
    } else {
        printf("Terminal deconectat\n");
    }

    return 0;
}
```

Schimbă **terminal_conectat** la **0** și rulează din nou. Rezultatul se inversează. Programarea devine interesantă din momentul în care începi să **te joci** cu valorile

---

## Misiune: Termostatul camerei calculatoarelor

Mainframe-urile centrului de calcul nu tolerează frigul: sub zero grade, uleiul din unitățile de bandă înghesuiește mecanismele. Termostatul trebuie să avertizeze operatorul de tură.

Scrie un program care, în interiorul lui **main**

- declară un **int** numit **temperatura**
- folosește un **if / else**: dacă `temperatura` este **mai mică decât 0** → afișează `alerta frig`, altfel → afișează `temperatura normala`

**Exemplu**

Pentru o **temperatura** de -5, programul tău ar afișa ceva de genul

```text
alerta frig
```
