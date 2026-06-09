Înainte ca compilatorul să-ți vadă măcar codul, rulează un pas special: **preprocesorul**. Toate acele linii care încep cu **#** sunt directive de preprocesor. Am folosit **#include** încă de la prima lecție. Hai să înțelegem ce se întâmplă cu adevărat

**#include** copiază întregul conținut al unui fișier în codul tău

```c
#include <stdio.h>    // header de sistem — din biblioteca standard C
#include "fisierul_meu.h"   // fișierul tău — caută mai întâi în directorul curent
```

Diferența: **< >** pentru header-ele de sistem, **" "** pentru fișierele tale. Când scrii **#include <stdio.h>**, preprocesorul lipește literalmente mii de linii de declarații în fișierul tău înainte de compilare. Așa devine **printf** disponibil

---

**#define** creează un **macro** — un nume care este înlocuit cu o valoare înainte de compilare

```c
#include <stdio.h>

#define MAX_HEALTH 100
#define PI 3.14159

int main(void) {
    int hp = MAX_HEALTH;
    printf("HP: %d\n", hp);
    printf("PI: %f\n", PI);
    return 0;
}
```

Oriunde preprocesorul vede **MAX_HEALTH**, îl înlocuiește cu **100**. Este o simplă substituție de text, ca un find-and-replace dintr-un editor de text. Compilatorul nu vede niciodată "MAX_HEALTH" — vede doar "100"

Prin convenție, macro-urile se scriu cu **MAJUSCULE** ca să le poți distinge de variabilele obișnuite

---

**#define** poate crea și macro-uri cu parametri

```c
#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define SQUARE(x) ((x) * (x))

int main(void) {
    printf("%d\n", MAX(10, 20));   // 20
    printf("%d\n", SQUARE(5));     // 25
    return 0;
}
```

Parantezele suplimentare sunt importante! Fără ele, **SQUARE(2+3)** s-ar expanda la **2+3 \* 2+3** = **2 + 6 + 3** = **11** în loc de **25**. Pune întotdeauna parametrii macro-urilor între paranteze

---

**Compilarea condiționată**: compilează cod diferit în funcție de condiții

```c
#include <stdio.h>

#define DEBUG

int main(void) {
    #ifdef DEBUG
        printf("Modul debug este ACTIV\n");
    #endif

    printf("Programul ruleaza\n");
    return 0;
}
```

Dacă **DEBUG** este definit, mesajul de debug este compilat. Dacă scoatem linia **#define DEBUG**, compilatorul sare complet peste acel printf — nici măcar nu există în programul final. Asta este folosit masiv în proiectele reale pentru a include/exclude logging-ul de debug

---

## Misiune: Configurarea Scuturilor

Generatorul de scuturi al stației folosește macro-uri de preprocesor pentru calculele geometrice. Trebuie să definești trei macro-uri pentru ca panoul de diagnostice să compileze și să afișeze citirile corecte.

Creează aceste macro-uri deasupra lui **main**:

- **AREA_RECT(w, h)** — returnează `((w) * (h))`
- **AREA_CIRCLE(r)** — returnează `((PI) * (r) * (r))` (PI este deja definit ca 3.14159)
- **MAX_SIZE** — definește-l ca `100`

Funcția **main** le apelează deja — doar adaugă definițiile macro-urilor.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Rectangle: 15
Circle: 50.27
Max: 100
```
