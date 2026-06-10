Până acum, fiecare variabilă ținea **un** singur lucru. Dar dacă vrem să stocăm scorurile unei clase întregi? Cinci variabile separate ar fi urât. Cincizeci ar fi imposibil. Avem nevoie de un **array**

Un **array** în C este o colecție cu mărime fixă de valori de **același tip**

```c
#include <stdio.h>

int main(void) {
    int scoruri[5] = { 80, 95, 60, 72, 88 };

    printf("%d\n", scoruri[0]);   // 80
    printf("%d\n", scoruri[1]);   // 95
    printf("%d\n", scoruri[4]);   // 88

    return 0;
}
```

Forma este **tip nume[marime]**. Am declarat **scoruri** ca un array de **5 int-uri**, apoi l-am umplut cu **{ ... }**

Exact ca în Python și Java, **numărarea începe de la 0**. **scoruri[0]** este primul element, **scoruri[4]** este ultimul (pentru că mărimea este 5, indicii sunt 0-4)

---

Putem lăsa C să **deducă mărimea** din inițializator

```c
#include <stdio.h>

int main(void) {
    int scoruri[] = { 80, 95, 60, 72, 88 };
    return 0;
}
```

Parantezele drepte sunt încă goale, dar array-ul are tot mărimea **5**. C numără valorile pentru noi. Este mai scurt și mai greu de greșit la tastare

Putem de asemenea să creăm un array **fără** a-l inițializa, apoi să-l umplem mai târziu

```c
#include <stdio.h>

int main(void) {
    int scoruri[5];
    scoruri[0] = 80;
    scoruri[1] = 95;
    scoruri[2] = 60;
    scoruri[3] = 72;
    scoruri[4] = 88;
    return 0;
}
```

**Atenție**: până nu atribuim valori, array-ul conține **gunoi** (orice era în acea memorie înainte). Citirea dintr-un array neinițializat este **undefined behavior** în C — programul tău ar putea afișa **0**, sau numere aleatoare, sau să se prăbușească. Inițializează întotdeauna înainte de a citi

---

Câte elemente are un array? Aici C este neprietenos comparat cu Python și Java

- Python: **len(arr)**
- Java: **arr.length**
- **C: nu există nicio metodă încorporată**

Array-ul nu **își cunoaște** propria mărime — este doar o bucată de memorie

Soluția clasică folosește **sizeof**

```c
#include <stdio.h>

int main(void) {
    int scoruri[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scoruri) / sizeof(scoruri[0]);
    printf("%d\n", n);   // 5
    return 0;
}
```

**sizeof(scoruri)** dă numărul total de bytes ai array-ului, **sizeof(scoruri[0])** dă numărul de bytes ai unui element. Împărțindu-i obținem numărul

**Capcană mare**: acest truc funcționează doar pe array-ul **original**. În momentul în care **pasezi un array unei funcții**, C îl convertește pe ascuns la un pointer, iar **sizeof** dă un rezultat diferit (greșit). Deci în practică, când scriem funcții care iau array-uri, **pasăm mărimea ca parametru separat**. Vom vedea asta în lecția următoare

---

Putem schimba valori exact ca în orice alt limbaj

```c
#include <stdio.h>

int main(void) {
    int scoruri[5] = { 80, 95, 60, 72, 88 };
    scoruri[1] = 100;
    printf("%d\n", scoruri[1]);   // 100
    return 0;
}
```

---

Ce se întâmplă dacă cerem un indice care nu există?

```c
#include <stdio.h>

int main(void) {
    int scoruri[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", scoruri[10]);
    return 0;
}
```

Rulează-l. **C NU verifică** dacă indicele este valid. Spre deosebire de Python (care aruncă **IndexError**) sau Java (care aruncă **ArrayIndexOutOfBoundsException**), C citește pur și simplu orice se întâmplă să fie la acea locație de memorie. Ai putea vedea **0**, sau gunoi aleator, sau programul tău s-ar putea prăbuși

**Verifică întotdeauna indicii**. Ieșirea în afara limitelor este unul dintre cele **mai periculoase bug-uri** din C și cauza multor **vulnerabilități reale de securitate** (buffer overflows). Bine ai venit la programarea low-level :)

---

## Misiune: Verificarea Registrului Echipajului

Manifestul echipajului stației tocmai a sosit ca un bloc gol de date. Sarcina ta este să completezi nivelurile de putere ale echipajului și să rulezi un diagnostic rapid.

1. Setează **eroi[0]** la **10**
2. Setează **eroi[1]** la **20**
3. Setează **eroi[2]** la **30**
4. Afișează **mărimea** array-ului (folosește trucul **sizeof**)
5. Afișează **primul** element
6. Afișează **ultimul** element (indicele **2**)

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `eroi` — un array de int cu 3 sloturi goale

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
3
10
30
```
