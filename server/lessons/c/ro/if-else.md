În viața reală luăm decizii: **dacă** e frig, iei un pulover, **altfel** un tricou este de ajuns. **Dacă** mi-e somn, dorm, **altfel** programez :)

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

Sintaxa din C este **aproape identică** cu cea din Java

- Condiția stă între **paranteze** **( )**
- Corpul stă între **acolade** **{ }**
- Nu există **:** la final ca în Python

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

Acesta este un **bug clasic în C**. Spre deosebire de Java (care refuză să compileze așa ceva), **C acceptă acest cod fără nicio eroare**. **x = 4** stochează **4** în **x** și returnează valoarea **4**, pe care C o tratează ca "adevărat" (orice valoare diferită de zero înseamnă adevărat). Așadar codul intră mereu în **if**, indiferent ce era **x** înainte. Multe bug-uri din proiecte reale, faimoase, vin exact din această greșeală de tastare. Folosește **==** când compari :)

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
    int utilizator_online = 1;

    if (utilizator_online) {
        printf("Tommy Vercetti joaca GTA Vice City\n");
    } else {
        printf("Tommy Vercetti este offline\n");
    }

    return 0;
}
```

Schimbă **utilizator_online** la **0** și rulează din nou. Rezultatul se inversează. Programarea devine distractivă din momentul în care începi să **te joci** cu valorile :)

---

## Misiune: Alertă Temperatură Carenă

Senzorii de carenă ai stației raportează temperatura de afară. Dacă scade sub zero, echipajul trebuie avertizat.

Scrie un **if / else** care verifică `temperatura`:

- dacă `temperatura` este **mai mică decât 0** → afișează `afara e ger`
- altfel → afișează `apa nu ingheata`

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `temperatura` — temperatura carenei în grade Celsius

**Exemplu**

Cu `temperatura = -5`, programul tău ar trebui să afișeze

```text
afara e ger
```

Acum setează `temperatura = 10` și rulează din nou

```text
apa nu ingheata
```
