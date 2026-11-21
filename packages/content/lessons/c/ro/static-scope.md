Fiecare variabilă are un **domeniu** (scope): partea din cod în care poate fi văzută. Până acum, cele mai multe variabile ale noastre au trăit într-o funcție

```c
#include <stdio.h>

void vizita(void) {
    int numar = 0;
    numar++;
    printf("numar este %d\n", numar);
}

int main(void) {
    vizita();
    vizita();
    vizita();
    return 0;
}
```

Ieșire

```text
numar este 1
numar este 1
numar este 1
```

numar e o variabilă **locală**. E făcută din nou de fiecare dată când pornește vizita și aruncată când vizita se termină. Trei apeluri, trei variabile numar diferite, fiecare trecând de la 0 la 1. main nici nu o poate vedea: dacă am scrie numar în main, codul nu s-ar compila

---

Un bloc între `{` și `}` are și el domeniul lui. O variabilă făcută într-un if sau într-un for dispare după acolada de închidere

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        int dublu = i * 2;
        printf("%d\n", dublu);
    }
    // aici i și dublu nu mai există
    return 0;
}
```

Ieșire

```text
0
2
4
```

---

O variabilă scrisă în afara oricărei funcții e **globală**. Orice funcție din fișier o poate vedea și schimba

```c
#include <stdio.h>

int vizite = 0;

void vizita(void) {
    vizite++;
}

int main(void) {
    vizita();
    vizita();
    printf("%d vizite\n", vizite);
    return 0;
}
```

Ieșire

```text
2 vizite
```

Merge, dar orice funcție poate schimba o variabilă globală, chiar și din greșeală. Într-un program mare, când o globală are o valoare ciudată, trebuie să căutăm peste tot ca să aflăm cine a schimbat-o. Folosește-le rar

---

Există și o cale de mijloc. O variabilă locală marcată cu **static** se vede doar în funcția ei, ca o variabilă locală. Dar e făcută o singură dată și își păstrează valoarea între apeluri, ca o globală

```c
#include <stdio.h>

int urmatorul_id(void) {
    static int ultimul = 100;
    ultimul++;
    return ultimul;
}

int main(void) {
    printf("%d\n", urmatorul_id());
    printf("%d\n", urmatorul_id());
    printf("%d\n", urmatorul_id());
    return 0;
}
```

Ieșire

```text
101
102
103
```

Linia `static int ultimul = 100;` rulează o singură dată, înainte de primul apel. După aceea, ultimul ține minte unde a rămas. Și nicio altă funcție nu se poate atinge de ea, deci doar urmatorul_id hotărăște numerele

---

Încă ceva despre nume: o variabilă dintr-un bloc poate avea același nume ca una din afara lui. Cea din interior o ascunde pe cea din afară până se termină blocul

```c
#include <stdio.h>

int main(void) {
    int x = 1;
    {
        int x = 2;
        printf("%d\n", x);
    }
    printf("%d\n", x);
    return 0;
}
```

Ieșire

```text
2
1
```

E permis, dar te încurci ușor. Dă nume diferite lucrurilor diferite

---

## Misiune: Cele două ghișee

Centrul de calcul are două ghișee. La ghișeul R predai o lucrare care trebuie rulată, la ghișeul P iei o listare tipărită. Fiecare vizitator ia un bon pentru un ghișeu, iar fiecare ghișeu își numerotează singur bonurile: R1, R2, R3 și P1, P2, P3

1. Scrie o funcție **int ia_bon(char ghiseu)** care întoarce următorul număr de bon pentru acel ghișeu, 'R' sau 'P'. Ține cele două numărători în variabile static din funcție
2. Citește un cuvânt de la input: ghișeele alese de vizitatori, în ordine, de exemplu RPRRP
3. Pentru fiecare literă, afișează ghișeul și numărul de bon pe care îl primește, câte unul pe linie

Cuvântul are între 1 și 50 de litere, fiecare R sau P

**Exemplu**

Intrare

```text
RPRRP
```

Ieșire

```text
R1
P1
R2
R3
P2
```
