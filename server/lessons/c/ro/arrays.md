Până acum, fiecare variabilă ținea **un** singur lucru. Dar dacă vrem să stocăm consumul orar al unei benzi magnetice pe mai multe ore? Cinci variabile separate ar fi urât. Cincizeci ar fi imposibil. Avem nevoie de un **array**

Un **array** în C este o colecție cu mărime fixă de valori de **același tip**

```c
#include <stdio.h>

int main(void) {
    int consum[5] = { 80, 95, 60, 72, 88 };

    printf("%d\n", consum[0]);   // 80
    printf("%d\n", consum[1]);   // 95
    printf("%d\n", consum[4]);   // 88

    return 0;
}
```

Forma este **tip nume[marime]**. Am declarat **consum** ca un array de **5 int-uri**, apoi l-am umplut cu **{ ... }**

**Numărarea începe de la 0**. **consum[0]** este primul element, **consum[4]** este ultimul (pentru că mărimea este 5, indicii sunt 0-4)

---

Putem lăsa C să **deducă mărimea** din inițializator

```c
#include <stdio.h>

int main(void) {
    int consum[] = { 80, 95, 60, 72, 88 };
    return 0;
}
```

Parantezele drepte sunt încă goale, dar array-ul are tot mărimea **5**. C numără valorile pentru noi. Este mai scurt și mai greu de greșit la tastare

Putem de asemenea să creăm un array **fără** a-l inițializa, apoi să-l umplem mai târziu

```c
#include <stdio.h>

int main(void) {
    int consum[5];
    consum[0] = 80;
    consum[1] = 95;
    consum[2] = 60;
    consum[3] = 72;
    consum[4] = 88;
    return 0;
}
```

**Atenție**: până nu atribuim valori, array-ul conține **gunoi** (orice era în acea memorie înainte). Citirea dintr-un array neinițializat este **undefined behavior** în C — programul tău ar putea afișa **0**, sau numere aleatoare, sau să se prăbușească. Inițializează întotdeauna înainte de a citi

---

Câte elemente are un array? Aici C nu ne ajută cu nimic — array-ul nu **își cunoaște** propria mărime, este doar o bucată de memorie

Soluția clasică folosește **sizeof**

```c
#include <stdio.h>

int main(void) {
    int consum[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(consum) / sizeof(consum[0]);
    printf("%d\n", n);   // 5
    return 0;
}
```

**sizeof(consum)** dă numărul total de bytes ai array-ului, **sizeof(consum[0])** dă numărul de bytes ai unui element. Împărțindu-i obținem numărul de elemente

**Capcană mare**: acest truc funcționează doar pe array-ul **original**. În momentul în care **pasezi un array unei funcții**, C îl convertește pe ascuns la un pointer, iar **sizeof** dă un rezultat diferit (greșit). Deci în practică, când scriem funcții care iau array-uri, **pasăm mărimea ca parametru separat**. Vom vedea asta în lecția următoare

---

Putem schimba valori exact ca la orice variabilă normală

```c
#include <stdio.h>

int main(void) {
    int consum[5] = { 80, 95, 60, 72, 88 };
    consum[1] = 100;
    printf("%d\n", consum[1]);   // 100
    return 0;
}
```

---

Ce se întâmplă dacă cerem un indice care nu există?

```c
#include <stdio.h>

int main(void) {
    int consum[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", consum[10]);
    return 0;
}
```

Rulează-l. **C NU verifică** dacă indicele este valid. C citește pur și simplu orice se întâmplă să fie la acea locație de memorie. Ai putea vedea **0**, sau gunoi aleator, sau programul tău s-ar putea prăbuși

**Verifică întotdeauna indicii**. Ieșirea în afara limitelor este unul dintre cele **mai periculoase bug-uri** din C și cauza multor **vulnerabilități reale de securitate** (buffer overflows). Bine ai venit la programarea low-level

---

## Misiune: Jurnalul de tură

Centrul de calcul rulează în trei schimburi. La finalul fiecărei ture, operatorul notează pe banda teletype-ului trei citiri de consum ale unității de bandă magnetică.

1. Citește **3 numere întregi** din input, unul câte unul, în array-ul **consum** (mărime 3): **consum[0]**, **consum[1]**, **consum[2]**
2. Afișează **mărimea** array-ului (folosește trucul **sizeof**)
3. Afișează **primul** element
4. Afișează **ultimul** element (indicele **2**)

**Exemplu**

Intrare

```text
10 20 30
```

Ieșire

```text
3
10
30
```

**Exemplu**

Intrare

```text
5 15 25
```

Ieșire

```text
3
5
25
```
