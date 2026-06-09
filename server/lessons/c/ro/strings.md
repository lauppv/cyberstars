În Python și Java, **string-urile** sunt un tip încorporat cu metode prietenoase. **În C, string-urile sunt diferite** — sunt **array-uri de caractere**. Mai puțin convenabile, dar vei înțelege exact cum funcționează textul în memorie

```c
#include <stdio.h>

int main(void) {
    char nume[] = "Tommy Vercetti";
    printf("%s\n", nume);
    return 0;
}
```

Afișează **Tommy Vercetti**. Format specifier-ul pentru un string este **%s**

Ce înseamnă **char nume[] = "Tommy Vercetti"**? Creează un array de **char**-uri care conține literele textului. **char[]** este "array de caractere", iar **""** este modul de a scrie un literal string care umple array-ul

---

În spatele scenei, fiecare string din C se termină cu un caracter ascuns special: **\0** (numit **null terminator**). El marchează sfârșitul string-ului. Deci **"Tommy"** în memorie este de fapt **T, o, m, m, y, \0** — șase caractere. Funcții precum **printf** continuă să citească până dau de **\0**

De obicei nu scrii **\0** singur atunci când folosești literali string. C îl adaugă pentru tine. Doar **fii conștient** că există, pentru că uitarea lui este o sursă clasică de bug-uri în C

---

Cât de lung este un string? Nu putem folosi **nume.length** ca în Java, pentru că C nu are metode. În schimb, folosim o funcție din biblioteca standard

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char nume[] = "Tommy Vercetti";
    printf("%zu\n", strlen(nume));   // 14
    return 0;
}
```

Două lucruri noi

- **#include <string.h>** — necesar pentru **strlen** și prietenii ei
- **%zu** — format specifier pentru tipul pe care **strlen** îl întoarce (un **size_t**, un fel de unsigned int). Pentru scopurile noastre, poți folosi și **%d** cu un cast: **printf("%d\n", (int) strlen(nume))**

**strlen** numără până la **\0**, fără a-l include. Deci **strlen("Tommy")** este **5**, deși array-ul are **6** sloturi în memorie

---

**Compararea string-urilor** — și **CEA MAI mare capcană din C legată de string-uri**

```c
#include <stdio.h>

int main(void) {
    char a[] = "salut";
    char b[] = "salut";

    if (a == b) {   // GREȘIT
        printf("egale\n");
    }
    return 0;
}
```

Asta compară **adresele de memorie**, nu **conținutul**. **a** și **b** sunt două array-uri diferite în memorie, deci asta **niciodată** nu afișează **egale**, deși ambele conțin "salut"

Modul corect este **strcmp** (string compare) din **<string.h>**

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "salut";
    char b[] = "salut";
    if (strcmp(a, b) == 0) {
        printf("egale\n");
    }
    return 0;
}
```

**strcmp** întoarce **0** când string-urile sunt **egale**. (Da, egal = 0. C este plin de mici ciudățenii ca asta :))

---

Un singur caracter la o poziție. Pentru că un string este doar un array, folosim indexarea

```c
#include <stdio.h>

int main(void) {
    char nume[] = "Tommy Vercetti";
    printf("%c\n", nume[0]);    // T
    printf("%c\n", nume[6]);    // V
    return 0;
}
```

**%c** este format specifier-ul pentru un singur **char**. Numărarea începe de la **0**, ca întotdeauna

---

Modificarea caracterelor

```c
#include <stdio.h>

int main(void) {
    char nume[] = "tommy";
    nume[0] = 'T';
    printf("%s\n", nume);   // Tommy
    return 0;
}
```

Putem schimba caractere individuale pentru că **nume** este un array pe care îl deținem. Observă **ghilimelele simple** pentru un singur char (**'T'**), și **ghilimelele duble** pentru un string (**"Tommy"**). Confundarea lor este una dintre cele mai comune greșeli în C

---

## Misiune: Decriptează Codul de Apel

O transmisie distorsionată tocmai a intrat. Ofițerul de comunicații a stocat-o într-un array de char. Sarcina ta: afișează codul complet de apel, lungimea lui, primul caracter și ultimul caracter ca puntea de comandă să poată verifica semnalul.

1. Afișează string-ul **nume** complet
2. Afișează **lungimea** lui (folosește **strlen**)
3. Afișează **primul** caracter (indicele **0**, folosește **%c**)
4. Afișează **ultimul** caracter (indicele **strlen(nume) - 1**, folosește **%c**)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `nume` — un array de char setat la **"lance vance"**

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
lance vance
11
l
e
```
