În lecția **if-else** am văzut o mică surpriză: **C nu are un tip boolean nativ**. Folosește **întregi**, unde **0** înseamnă **false** și **orice altceva** înseamnă **true**

```c
#include <stdio.h>

int main(void) {
    int este_utilizator_online = 1;   // "true"
    int este_ascuns = 0;              // "false"

    if (este_utilizator_online) {
        printf("online\n");
    }
    return 0;
}
```

Asta funcționează, dar a citi **int este_utilizator_online = 1** este stângaci. Arată ca un contor, nu ca o valoare true/false

---

Vestea bună: începând cu C99, biblioteca standard ne dă un tip boolean real

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool este_online = true;
    bool are_cheie = false;

    printf("%d\n", este_online);   // 1
    printf("%d\n", are_cheie);     // 0

    return 0;
}
```

După ce facem **#include <stdbool.h>**, există trei identificatori noi: **bool**, **true** și **false**

În spatele cortinei, **bool** este în esență tot un int — **true** este **1**, **false** este **0** — dar numele fac codul nostru mult mai **lizibil**. De acum încolo, când ceva poate fi doar true sau false, preferă **bool** în loc de **int**

Nu există un format specifier special pentru **bool** în **printf** — folosește doar **%d** (va afișa **0** sau **1**)

---

Putem combina booleans cu operatori logici

- **&&** → **and** (ambele trebuie să fie true)
- **||** → **or** (cel puțin una trebuie să fie true)
- **!** → **not** (inversează valoarea)

Un exemplu real: pentru a conduce o mașină, trebuie să ai **cel puțin 18 ani ȘI să ai permis**

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int varsta = 20;
    bool are_permis = true;

    if (varsta >= 18 && are_permis) {
        printf("Poti conduce\n");
    } else {
        printf("Scuze, azi nu conduci\n");
    }

    return 0;
}
```

---

**||** este mai relaxat. Doar una dintre condiții fiind true este suficient

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool este_vip = false;
    bool are_invitatie = true;

    if (este_vip || are_invitatie) {
        printf("Bun venit in club\n");
    } else {
        printf("Acces refuzat\n");
    }
    return 0;
}
```

---

**!** inversează un boolean. **!true** devine **false**, și viceversa

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool este_autentificat = false;
    if (!este_autentificat) {
        printf("Te rog autentifica-te mai intai\n");
    }
    return 0;
}
```

---

## Misiune: Accesul în sala calculatoarelor

Sala calculatoarelor centrului de date se încuie automat. Poarta programează un panou care decide cine intră: o persoană poate trece dacă este **angajat ȘI este zi lucrătoare**, SAU dacă este **oaspete CU o invitație**.

Citește patru numere întregi (**0** sau **1**), separate prin spațiu, în această ordine: **este_angajat**, **este_zi_lucratoare**, **este_oaspete**, **are_invitatie**. Scrie un **if / else** folosind `&&` și `||` care afișează verdictul corect

**Exemplu**

Input

```text
1 1 0 0
```

Output

```text
Acces permis
```

**Exemplu**

Input

```text
0 0 1 0
```

Output

```text
Acces refuzat
```
