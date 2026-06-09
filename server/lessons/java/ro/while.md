Buclele **for** sunt grozave când știm **de câte ori** vrem să repetăm. Dar uneori vrem să continuăm **atâta timp cât** ceva este adevărat, fără să știm dinainte câte iterații înseamnă asta. Aceasta este treaba lui **while**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i < 10) {
            System.out.println(i);
            i++;
        }
    }
}
```

Output

```text
0
1
2
3
4
5
6
7
8
9
```

De ce nu apare **10**? Pentru că atunci când **i = 10**, condiția **10 < 10** este **falsă**, așa că ieșim

Dacă am fi vrut ca **10** să fie inclus, am scrie

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i <= 10) {
            System.out.println(i);
            i++;
        }
    }
}
```

Acum **10 <= 10** este **adevărat**, așa că intrăm încă o dată

---

**while** rulează **atâta timp cât** condiția este **adevărată**

**Fii foarte atent**. Dacă uităm să actualizăm **i** în interiorul buclei, obținem o **buclă infinită**

```java
public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i <= 100) {
            System.out.println(i);
            // am uitat i++
        }
    }
}
```

**i** rămâne **0** pentru totdeauna, așa că condiția este mereu **adevărată**, iar programul afișează **0** la nesfârșit. Rulează acest cod (pe scurt) ca să vezi ce se întâmplă. Nu-ți face griji, platforma îl oprește după 5 secunde :)

Acesta este un bug foarte des întâlnit. Oricând scrii un **while**, întreabă-te: "ce face ca această condiție să devină în cele din urmă falsă?". Dacă răspunsul este "nimic", ai o problemă

---

Când să alegi **for** vs **while**?

- **for** când știi numărul ("fă asta de 10 ori", "parcurge fiecare element al unui array")
- **while** când condiția de oprire depinde de ceva din interiorul buclei ("continuă să întrebi utilizatorul până când tastează **quit**", "continuă să împarți la 2 până când numărul este sub 1")

Ambele sunt la fel de puternice — orice poți face cu una, poți face cu cealaltă. Stilul și lizibilitatea decid :)

---

## Misiune: Semnal Pierdut

Comunicatorul unui membru al echipajului este blocat într-o **buclă infinită** — transmite la nesfârșit `I am online` și nu se oprește niciodată.

Repară codul din dreapta astfel încât comunicatorul să transmită **o singură dată**, apoi să se deconecteze. Trebuie să **schimbi** variabila `esteOnline` din interiorul buclei astfel încât condiția să devină în cele din urmă **falsă**.

**Input** (deja setat în partea de sus a codului tău):

- `esteOnline` — dacă comunicatorul este activ (`true` la început)

**Exemplu**

După reparația ta, programul ar trebui să afișeze exact

```text
Sunt online
Acum sunt offline
```
