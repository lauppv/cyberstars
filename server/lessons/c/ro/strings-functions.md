Am învățat că string-urile în C sunt tablouri de **char** care se termină cu **'\0'**. Să lucrezi cu ele manual (caracter cu caracter) este obositor. Biblioteca **string.h** ne dă funcții gata făcute

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char nume[] = "Tommy Vercetti";
    printf("Lungime: %lu\n", strlen(nume));
    return 0;
}
```

Output: **Lungime: 14**

**strlen** returnează numărul de caractere din string, **FĂRĂ** a număra **'\0'**. Tabloul real are 15 char-uri (14 litere + '\0'), dar strlen spune 14. Este o distincție importantă

---

**strcmp** — compară două string-uri

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "apple";
    char b[] = "banana";
    char c[] = "apple";

    printf("%d\n", strcmp(a, b));   // negativ (a vine inainte de b)
    printf("%d\n", strcmp(b, a));   // pozitiv (b vine dupa a)
    printf("%d\n", strcmp(a, c));   // 0 (sunt egale)
    return 0;
}
```

**strcmp** returnează **0** dacă string-urile sunt egale, un număr **negativ** dacă primul vine înainte de al doilea (alfabetic), și un număr **pozitiv** dacă vine după. Reține: în C, **nu poți compara string-uri cu ==**. Asta compară **adrese**, nu conținut

---

**strcpy** — copiază un string în altul

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char sursa[] = "Salut";
    char dest[20];

    strcpy(dest, sursa);
    printf("%s\n", dest);   // Salut
    return 0;
}
```

**strcpy(dest, sursa)** copiază totul din **sursa** în **dest**, inclusiv **'\0'**. Asigură-te că **dest** este suficient de mare! Dacă este prea mic, obții un **buffer overflow** — unul dintre cele mai periculoase bug-uri din programare. Așa apar vulnerabilitățile reale de securitate

---

**strcat** — concatenează (unește) două string-uri

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char salut[50] = "Salut, ";
    strcat(salut, "CyberStars!");
    printf("%s\n", salut);   // Salut, CyberStars!
    return 0;
}
```

**strcat** adaugă al doilea string la finalul primului. Din nou, asigură-te că tabloul destinație este suficient de mare pentru ambele string-uri plus **'\0'**

---

Un truc util: **strstr** — găsește un sub-string

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[] = "imi place programarea in C";
    char *gasit = strstr(text, "programarea");

    if (gasit != NULL) {
        printf("Gasit: %s\n", gasit);   // Gasit: programarea in C
    }
    return 0;
}
```

**strstr** returnează un pointer către locul unde începe sub-string-ul, sau **NULL** dacă nu este găsit. **NULL** este felul lui C de a spune "nimic" — este o valoare specială de pointer care înseamnă "pointează către nimic." Îl vom vedea des

---

## Misiune: Asamblarea Numelui de Cod al Stației

HQ a trimis două jumătăți ale noului nume de cod al stației în transmisii separate. Treaba ta: măsoară primul fragment, apoi unește ambele fragmente într-un singur string și transmite numele complet.

1. Afișează lungimea lui **primul** (folosește **strlen**)
2. Copiază **primul** într-un tablou **rezultat** (folosește **strcpy**, fă rezultat suficient de mare: `char rezultat[50]`)
3. Concatenează **al_doilea** la **rezultat** (folosește **strcat**)
4. Afișează **rezultat**

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `primul` — un tablou de char setat la **"Cyber"**
- `al_doilea` — un tablou de char setat la **"Stars"**

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
5
CyberStars
```
