Orice programator C, în fiecare zi a vieții lui, scrie cod care nu se compilează. E normal. Diferența o face cât de repede înțelegem ce ne spune gcc. Mesajele lui par înfricoșătoare la început, dar toate au aceeași formă

---

```c
#include <stdio.h>

int main(void) {
    int numar = 3
    printf("%d\n", numar);
    return 0;
}
```

gcc răspunde

```text
program.c: In function 'main':
program.c:5:5: error: expected ',' or ';' before 'printf'
    5 |     printf("%d\n", numar);
      |     ^~~~~~
```

Citește-l pe bucăți

- `program.c:5:5` e fișierul, **linia** și **coloana** unde gcc a observat problema
- `error:` înseamnă că programul nu poate fi construit. Un `warning:` (avertisment) l-ar construi totuși, dar ceva arată greșit
- restul spune ce aștepta gcc și n-a găsit
- dedesubt, gcc arată linia și pune `^` exact sub locul cu pricina

Observă ceva: `;`-ul lipsă e la finalul liniei 4, dar gcc se plânge de linia 5. gcc își dă seama că lipsește ceva abia când vede lucrul următor, printf, acolo unde ar fi trebuit să fie un `;`. Așa că, atunci când o eroare nu are sens pe linia ei, uită-te la linia **dinaintea** ei

---

```c
#include <stdio.h>

int main(void) {
    int total = 10;
    printf("%d\n", totl);
    return 0;
}
```

```text
program.c:5:20: error: 'totl' undeclared (first use in this function); did you mean 'total'?
```

**undeclared** (nedeclarat) înseamnă că gcc n-a auzit niciodată de acel nume. De cele mai multe ori e o greșeală de scriere sau o variabilă folosită în afara domeniului ei. gcc chiar ghicește ce am vrut să scriem

---

```c
#include <stdio.h>

int main(void) {
    char nume[] = "Ada";
    printf("%d\n", (int)strlen(nume));
    return 0;
}
```

```text
program.c:5:25: error: implicit declaration of function 'strlen' [-Wimplicit-function-declaration]
program.c:2:1: note: include '<string.h>' or provide a declaration of 'strlen'
```

**implicit declaration** înseamnă că am apelat o funcție pe care gcc n-o cunoaște. Ori numele e greșit, ori am uitat #include-ul care o aduce. O linie `note:` sub o eroare dă ajutor în plus, iar aici ne spune exact ce include lipsește

---

```c
#include <stdio.h>

int patrat(int x) {
    return x * x;
}

int main(void) {
    printf("%d\n", patrat(2, 3));
    return 0;
```

```text
program.c:8:20: error: too many arguments to function 'patrat'; expected 1, have 2
program.c:9:5: error: expected declaration or statement at end of input
```

Aici sunt două erori. Prima e clară: patrat primește o valoare, iar noi i-am dat 2. A doua e despre `}`-ul care lipsește la finalul lui main. gcc citește până la capătul fișierului, tot așteptându-l. Când vezi **at end of input**, numără-ți acoladele

---

Uneori codul se compilează, iar apoi se plânge o altă unealtă

```text
undefined reference to `patrt'
ld returned 1 exit status
```

`ld` e **linkerul**, unealta care unește codul nostru cu codul bibliotecilor după ce gcc a terminat. „Undefined reference” înseamnă că un cod apelează o funcție pe care n-a scris-o nimeni, de obicei pentru că numele e scris diferit în două locuri

---

Cea mai importantă regulă: **repară întâi prima eroare**. O singură greșeală îl poate încurca pe gcc atât de tare încât raportează după ea încă cinci erori, erori care dispar singure după ce o repari pe prima. Așa că citește primul mesaj, repară, compilează din nou și tot așa

---

## Misiune: Raportul de tură stricat

Un stagiar a scris un program pentru raportul de tură și a plecat acasă. Programul nu se compilează. Citește numele unui operator și orele turelor lui și ar trebui să afișeze un raport scurt. Copiază-l în editor exact cum e, apasă Run și repară-l citind ce spune gcc. Repară întâi prima eroare

```c
#include <stdio.h>

int cea_mai_lunga(int v[], int n) {
    int maxim = v[0]
    for (int i = 1; i < n; i++) {
        if (v[i] > maxim) {
            maxim = v[i];
        }
    }
    return maxim;
}

int main(void) {
    char nume[32];
    int n;
    int ore[50];
    int total = 0;
    scanf("%31s %d", nume, &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &ore[i]);
        total = totl + ore[i];

    printf("%s (%d litere)\n", nume, (int)strlen(nume));
    printf("Ture: %d\n", n);
    printf("Ore: %d\n", total);
    printf("Cea mai lunga tura: %d\n", cea_mai_lunga(ore, n, total));
    return 0;
}
```

Sunt cinci greșeli, dar prima dată gcc arată mai mult de cinci erori. Datele de intrare sunt un nume, apoi numărul de ture n, apoi cele n ture, în ore. n e între 1 și 50

**Exemplu**

Intrare

```text
ada 3
8 12 6
```

Ieșire

```text
ada (3 litere)
Ture: 3
Ore: 26
Cea mai lunga tura: 12
```
