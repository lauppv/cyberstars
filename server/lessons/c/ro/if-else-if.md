Uneori avem nevoie de **mai mult de două** ramuri. Imaginează-ți un mainframe care pornește dimineața la centrul de calcul. În funcție de câte secunde mai sunt până la pornirea completă, sistemul trece prin etape diferite

Dacă mai sunt **100** de secunde → verificăm memoria

Dacă mai sunt **60** de secunde → verificăm perifericele

Dacă mai sunt **20** de secunde → încărcăm nucleul sistemului de operare

Dacă mai sunt **10** secunde → pornim procesele de sistem

Altfel → nu facem nimic special

În C înlănțuim ramurile cu **else if**

```c
#include <stdio.h>

int main(void) {
    int secunde = 100;

    if (secunde == 100) {
        printf("Verific memoria\n");
    } else if (secunde == 60) {
        printf("Verific perifericele\n");
    } else if (secunde == 20) {
        printf("Incarc nucleul sistemului de operare\n");
    } else if (secunde == 10) {
        printf("Pornesc procesele de sistem\n");
    } else {
        printf("%d secunde nu au niciun efect\n", secunde);
    }

    return 0;
}
```

Hai să urmărim ce se întâmplă dacă schimbăm **secunde** la **60**, **20**, **10**, **42**

Lanțul rulează **de sus în jos**. La **prima** ramură care este **adevărată**, C rulează acel bloc și apoi **iese** din întregul lanț. Ramurile rămase **nu** sunt verificate niciodată. Așadar pentru **secunde = 60**, se afișează o singură linie, nu toate

---

De ce să nu scriem pur și simplu o grămadă de **if**-uri separate? Așa

```c
#include <stdio.h>

int main(void) {
    int secunde = 60;
    if (secunde == 100) { printf("100\n"); }
    if (secunde == 60) { printf("60\n"); }
    if (secunde == 20) { printf("20\n"); }
    else { printf("altceva\n"); }
    return 0;
}
```

Problema: fiecare **if** este independent. **else**-ul de la final aparține doar **ultimului if**. Așadar pentru **secunde = 60**, a treia condiție eșuează (60 != 20), iar **else**-ul ar afișa **"altceva"** — greșit, am tratat deja 60 mai sus

**Regulă practică**: când testăm **aceeași variabilă** pentru mai multe valori, **înlănțuim** cu **if / else if / else**

---

C are de asemenea o instrucțiune **switch** care se potrivește bine acestui tipar, dar o vom lăsa pentru o lecție mai avansată. Pentru moment, **if / else if / else** este suficient

---

Putem îmbrica **if**-uri unul în altul

```c
#include <stdio.h>

int main(void) {
    int secunde = 5;
    int eroare_detectata = 0;

    if (secunde < 10) {
        if (eroare_detectata) {
            printf("Eroare detectata. Anulez pornirea\n");
        } else {
            printf("Nicio eroare detectata. Pornesc sistemul...\n");
        }
    }
    return 0;
}
```

**if**-urile îmbricate sunt în regulă, dar dacă ajungi la 5 niveluri de adâncime, codul devine ilizibil. Încearcă să păstrezi lucrurile plate când poți

---

## Misiune: Secvența de pornire a mainframe-ului

Tu ești operatorul de tură. Cronometrul de pornire afișează câte secunde mai sunt până la boot complet, iar un senzor separat îți spune dacă a fost detectată vreo eroare hardware.

Scrie un lanț **if / else if / else** care citește două numere întregi din input, în această ordine: **secunde** și **eroare_detectata**

- dacă `secunde` este **100** → afișează `Verific memoria`
- altfel dacă `secunde` este **60** → afișează `Verific perifericele`
- altfel dacă `secunde` este **30** → afișează `Incarc nucleul sistemului de operare`
- altfel dacă `secunde` este **10** → afișează `Pornesc procesele de sistem`
- altfel dacă `secunde` este **mai mic decât 10** → verifică `eroare_detectata`: dacă este **1**, afișează `Eroare detectata. Anulez pornirea`, altfel afișează `Nicio eroare detectata. Pornesc sistemul...`
- altfel → afișează `%d secunde nu au niciun efect` (cu numărul de secunde în loc de `%d`)

**Exemplu**

Input

```text
30 0
```

Output

```text
Incarc nucleul sistemului de operare
```

**Exemplu**

Input

```text
5 1
```

Output

```text
Eroare detectata. Anulez pornirea
```
