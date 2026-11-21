Textul și numerele nu sunt același lucru. Șirul "42" are trei caractere: '4', '2' și '\0'. Ca să-l adunăm cu ceva, trebuie întâi să-l facem int-ul 42. Când citim o linie întreagă cu fgets sau o împărțim cu strtok, primim text, deci avem nevoie de asta des

---

Cea mai rapidă cale e **atoi**, din stdlib.h: „ASCII to integer”

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char text[] = "42";
    int n = atoi(text);
    printf("%d\n", n + 8);
    printf("%d\n", atoi("salut"));
    return 0;
}
```

Ieșire

```text
50
0
```

atoi are un punct slab: când textul nu e un număr, întoarce 0. Și "0" dă tot 0. Deci nu putem deosebi un zero adevărat de o greșeală

---

**strtol** („string to long”) poate. Pe lângă număr, ne spune unde s-a oprit din citit, printr-un pointer pe care i-l dăm

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char bun[] = "128";
    char gresit[] = "12abc";
    char *sfarsit;

    long a = strtol(bun, &sfarsit, 10);
    printf("%ld, rest: '%s'\n", a, sfarsit);

    long b = strtol(gresit, &sfarsit, 10);
    printf("%ld, rest: '%s'\n", b, sfarsit);
    return 0;
}
```

Ieșire

```text
128, rest: ''
12, rest: 'abc'
```

10 spune că numărăm în baza 10. După apel, sfarsit arată spre primul caracter pe care nu l-a putut citi. Dacă acel caracter e `'\0'`-ul de la finalul șirului, tot textul a fost un număr. Dacă nu, mai era altceva în el. Întoarce un long, deci îl afișăm cu **%ld**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *texte[] = { "128", "12abc" };
    for (int i = 0; i < 2; i++) {
        char *sfarsit;
        long numar = strtol(texte[i], &sfarsit, 10);
        if (*sfarsit == '\0') {
            printf("%s: numarul %ld\n", texte[i], numar);
        } else {
            printf("%s: nu e un numar\n", texte[i]);
        }
    }
    return 0;
}
```

Ieșire

```text
128: numarul 128
12abc: nu e un numar
```

Încă o verificare: un șir gol nu are deloc cifre, iar sfarsit rămâne la începutul lui, care e tot `'\0'`. Așa că verifică și că textul nu e gol

---

Când o linie are o formă fixă, ca un cuvânt urmat de un număr, **sscanf** o citește dintr-odată. Merge ca scanf, dar citește dintr-un șir în loc să citească de la input

```c
#include <stdio.h>

int main(void) {
    char linie[] = "banda 7";
    char nume[32];
    int numar;

    int gasite = sscanf(linie, "%31s %d", nume, &numar);
    printf("%d valori: %s si %d\n", gasite, nume, numar);
    return 0;
}
```

Ieșire

```text
2 valori: banda si 7
```

`%31s` citește un cuvânt de cel mult 31 de caractere, ca să încapă în nume[32] împreună cu '\0'. Și exact ca scanf, sscanf întoarce câte valori a citit. Pentru "banda sapte", %s citește cuvântul, %d nu găsește cifre și întoarce 1. Valoarea întoarsă e verificarea noastră

---

## Misiune: Cartelele de lucrări

Fiecare lucrare pentru mainframe vine pe o cartelă cu două lucruri pe ea: numele lucrării și câte minute îi trebuie, de exemplu "compile 12". Unele cartele au fost perforate prost: lipsesc minutele sau sunt scrise în litere. Planificatorul trebuie să sară peste acele cartele și să spună care au fost

1. Citește cartele, câte una pe linie, până se termină datele
2. Citește fiecare cartelă cu sscanf. O cartelă bună îți dă și un nume, și un număr întreg de minute
3. Pentru fiecare cartelă greșită, afișeaz-o ca în exemplu
4. La final, afișează câte lucrări bune au fost și suma minutelor lor

Nu există linii goale. Un nume e un cuvânt de cel mult 20 de litere, iar o cartelă are cel mult 50 de caractere

**Exemplu**

Intrare

```text
compile 12
print twelve
sort 30
backup
```

Ieșire

```text
Cartela gresita: print twelve
Cartela gresita: backup
Lucrari: 2
Minute: 42
```
