Buclele **for** sunt grozave când știm **de câte ori** vrem să repetăm. Dar uneori vrem să continuăm **atâta timp cât** ceva este adevărat, fără să știm dinainte câte iterații înseamnă asta. Aceasta este treaba lui **while**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 10) {
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

Output: **0** până la **9**, câte unul pe linie. De ce nu apare **10**? Pentru că **10 < 10** este **fals**, așa că ieșim înainte să-l afișăm

Dacă am fi vrut ca **10** să fie inclus

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i <= 10) {
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

Acum **10 <= 10** este **adevărat**, așa că intrăm încă o dată

---

**while** rulează **atâta timp cât** condiția este **adevărată**

**Fii foarte atent**. Dacă uităm să actualizăm **i** în interiorul buclei, avem o **buclă infinită**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i <= 100) {
        printf("%d\n", i);
        // am uitat i++
    }
    return 0;
}
```

**i** rămâne **0**, condiția este mereu **adevărată**, iar programul afișează **0** la nesfârșit. Platforma îl oprește după 5 secunde. În viața reală, o buclă infinită îți poate îngheța întregul calculator

Oricând scrii un **while**, întreabă-te: "ce face ca această condiție să devină în cele din urmă falsă?". Dacă răspunsul este "nimic", ai un bug

---

Când să alegi **for** vs **while**?

- **for** când numărul este cunoscut ("fă asta de 10 ori", "parcurge fiecare element al unui array")
- **while** când condiția de oprire depinde de ceva din interiorul buclei ("continuă cât timp mai sunt cartele perforate în stivă", "continuă să împarți până când numărul este sub 1")

Ambele sunt la fel de puternice — orice poți face cu una, poți face cu cealaltă. Stilul și lizibilitatea decid

---

C are și forma **do { ... } while (...)** care rulează corpul **cel puțin o dată** înainte de a verifica condiția. Nu o vom folosi mult în aceste lecții, dar e bine de știut că există

---

## Misiune: Numărătoarea Teleimprimantei

La Bell Labs, înainte de a lansa o rulare de compilare pe mainframe, operatorul de tură pornea o numărătoare inversă pe teleimprimantă, ca toată lumea din centrul de calcul să știe când începe zgomotul benzii magnetice.

Scrie un program care, în interiorul lui **main**

- declară un **int** numit **n**
- folosește o buclă **while** care afișează valoarea lui **n**, apoi o scade cu 1, cât timp **n** este mai mare decât 0
- după ce bucla se termină, afișează **Start**

**Exemplu**

Pentru un **n** de 5, programul tău ar afișa ceva de genul

```text
5
4
3
2
1
Start
```
