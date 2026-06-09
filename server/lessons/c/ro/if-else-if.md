Uneori avem nevoie de **mai mult de două** ramuri. Imaginează-ți o rachetă care decolează de la sol. În funcție de câte secunde au rămas, vrem să facem lucruri diferite

Dacă mai sunt **100** de secunde → pornim calculatoarele de la bord

Dacă mai sunt **60** de secunde → verificăm conexiunea cu turnul de control

Dacă mai sunt **20** de secunde → pornim motoarele secundare

Dacă mai sunt **10** secunde → pornim motoarele principale

Altfel → nu facem nimic special

În C înlănțuim ramurile cu **else if** (exact ca în Java)

```c
#include <stdio.h>

int main(void) {
    int secunde = 100;

    if (secunde == 100) {
        printf("Pornesc toate calculatoarele de la bord\n");
    } else if (secunde == 60) {
        printf("Verific conexiunea cu turnul de control\n");
    } else if (secunde == 20) {
        printf("Pornesc motoarele secundare\n");
    } else if (secunde == 10) {
        printf("Pornesc motoarele principale\n");
    } else {
        printf("%d secunde nu au niciun efect\n", secunde);
    }

    return 0;
}
```

**Rulează-l**. Apoi schimbă **secunde** la **60**, **20**, **10**, **42**. Vezi cum se schimbă rezultatul

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

Problema: fiecare **if** este independent. **else**-ul de la final aparține doar **ultimului if**. Așadar pentru **secunde = 60**, a treia condiție eșuează (60 != 20), iar **else**-ul ar afișa **"60 de secunde nu au niciun efect"** — greșit, am tratat deja 60 mai sus

**Regulă practică**: când testăm **aceeași variabilă** pentru mai multe valori, **înlănțuim** cu **if / else if / else**

---

C are de asemenea o instrucțiune **switch** care se potrivește bine acestui tipar, dar o vom lăsa pentru o lecție mai avansată. Pentru moment, **if / else if / else** este suficient :)

---

Putem imbrica **if**-uri unul în altul

```c
#include <stdio.h>

int main(void) {
    int secunde = 5;
    int eroare_detectata = 0;

    if (secunde < 10) {
        if (eroare_detectata) {
            printf("Eroare detectata. Anulez misiunea\n");
        } else {
            printf("Nicio eroare detectata. Decolez...\n");
        }
    }
    return 0;
}
```

**if**-urile imbricate sunt în regulă, dar dacă ajungi la 5 niveluri de adâncime, codul devine ilizibil. Încearcă să păstrezi lucrurile plate când poți

---

## Misiune: Secvența de Lansare

Tu ești controlorul de lansare. Cronometrul de numărătoare inversă afișează `secunde` rămase. În funcție de valoare, trebuie să se activeze sisteme diferite.

Codul din dreapta are deja întregul lanț. Sarcina ta: **adaugă o nouă ramură else if** pentru **30 de secunde** care afișează `Presurizez rezervoarele de combustibil`.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `secunde` — secunde rămase până la lansare
- `eroare_detectata` — dacă a fost detectată o eroare (0 = nu, 1 = da)

**Exemplu**

Cu `secunde = 30`, programul tău ar trebui să afișeze

```text
Presurizez rezervoarele de combustibil
```

Schimbă `secunde` la `60`, `10`, `5` și rulează din nou — vezi întreaga secvență în acțiune :)
