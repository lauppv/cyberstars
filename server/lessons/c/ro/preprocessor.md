Înainte ca compilatorul să-ți vadă măcar codul, rulează un pas special: **preprocesorul**. Toate acele linii care încep cu **#** sunt directive de preprocesor. Am folosit **#include** încă de la prima lecție. Hai să înțelegem ce se întâmplă cu adevărat

**#include** copiază întregul conținut al unui fișier în codul tău

```text
#include <stdio.h>    // header de sistem — din biblioteca standard C
#include "fisierul_meu.h"   // fisierul tau — cauta mai intai in directorul curent
```

Diferența: **< >** pentru header-ele de sistem, **" "** pentru fișierele tale. Când scrii **#include <stdio.h>**, preprocesorul lipește literalmente mii de linii de declarații în fișierul tău înainte de compilare. Așa devine **printf** disponibil

---

**#define** creează un **macro** — un nume care este înlocuit cu o valoare înainte de compilare

```c
#include <stdio.h>

#define VITEZA_MAX 9600
#define PI 3.14159

int main(void) {
    int baud = VITEZA_MAX;
    printf("Viteza: %d\n", baud);
    printf("PI: %f\n", PI);
    return 0;
}
```

Oriunde preprocesorul vede **VITEZA_MAX**, îl înlocuiește cu **9600**. Este o simplă substituție de text, ca un find-and-replace dintr-un editor de text. Compilatorul nu vede niciodată "VITEZA_MAX" — vede doar "9600"

Prin convenție, macro-urile se scriu cu **MAJUSCULE** ca să le poți distinge de variabilele obișnuite

---

**#define** poate crea și macro-uri cu parametri

```c
#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define PATRAT(x) ((x) * (x))

int main(void) {
    printf("%d\n", MAX(10, 20));   // 20
    printf("%d\n", PATRAT(5));     // 25
    return 0;
}
```

Parantezele suplimentare sunt importante! Fără ele, **PATRAT(2+3)** s-ar expanda la **2+3 \* 2+3** = **2 + 6 + 3** = **11** în loc de **25**. Pune întotdeauna parametrii macro-urilor între paranteze

---

**Compilarea condiționată**: compilează cod diferit în funcție de condiții

```c
#include <stdio.h>

#define DEBUG

int main(void) {
    #ifdef DEBUG
        printf("Mod debug activ\n");
    #endif

    printf("Terminal pornit\n");
    return 0;
}
```

Dacă **DEBUG** este definit, mesajul de debug este compilat. Dacă scoatem linia **#define DEBUG**, compilatorul sare complet peste acel printf — nici măcar nu există în programul final. Asta este folosit masiv în proiectele reale pentru a include/exclude logging-ul de debug fără să ștergi codul

---

## Misiune: Fișa de instalare a echipamentelor

Ești tehnician la centrul de calcul. Înainte de a preda noul rack de servere și antena satelit de pe acoperiș, trebuie să completezi fișa de configurare a compilatorului cu macro-urile folosite la calculele geometrice — panoul de diagnostice depinde de ele ca să compileze.

Deasupra lui **main**, definește:

- **PI** — `3.14159`
- **AREA_RECT(w, h)** — returnează `((w) * (h))` (suprafața sălii de echipamente)
- **AREA_CIRCLE(r)** — returnează `((PI) * (r) * (r))` (suprafața antenei)
- **MAX_SIZE** — `100` (limita de temperatură a sălii, în grade)

În **main**, folosește macro-urile ca să afișezi:

1. `AREA_RECT(5, 3)` pe formatul **"Sala: %d"**
2. `AREA_CIRCLE(4.0)` pe formatul **"Antena: %.2f"**
3. `MAX_SIZE` pe formatul **"Limita: %d"**

**Exemplu**

Programul tău ar trebui să afișeze

```text
Sala: 15
Antena: 50.27
Limita: 100
```
