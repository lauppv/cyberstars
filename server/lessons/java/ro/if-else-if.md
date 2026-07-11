Uneori avem nevoie de **mai mult de două** ramuri. Imaginează-ți o rachetă care decolează de la sol. În funcție de câte secunde au rămas, vrem să facem lucruri diferite

Dacă mai avem **100** de secunde → pornim calculatoarele de la bord

Dacă mai avem **60** de secunde → verificăm conexiunea cu turnul de control

Dacă mai avem **20** de secunde → pornim motoarele secundare

Dacă mai avem **10** secunde → pornim motoarele principale

Altfel → nu facem nimic special

În Java folosim **else if** — două cuvinte, scrise pe larg

```java
public class Main {
    public static void main(String[] args) {
        int secunde = 100;

        if (secunde == 100) {
            System.out.println("Pornesc toate calculatoarele de la bord");
        } else if (secunde == 60) {
            System.out.println("Verific conexiunea cu turnul de control");
        } else if (secunde == 20) {
            System.out.println("Pornesc motoarele secundare");
        } else if (secunde == 10) {
            System.out.println("Pornesc motoarele principale");
        } else {
            System.out.println(secunde + " secunde nu au niciun efect");
        }
    }
}
```

**Rulează** asta. Apoi schimbă **secunde** la **60**, **20**, **10**, **9**, **42**. Vezi cum se schimbă rezultatul

Lanțul rulează **de sus în jos**. La **prima** condiție care este **adevărată**, Java intră în acel bloc, îl rulează și **iese** din întregul lanț. Ramurile rămase **nu** sunt **niciodată** verificate. Asta este important — dacă **secunde == 60**, lanțul afișează **"Verific conexiunea..."** și apoi iese

---

De ce să nu scriem pur și simplu o grămadă de **if**-uri separate? Așa

```java
public class Main {
    public static void main(String[] args) {
        int secunde = 60;
        if (secunde == 100) { System.out.println("100"); }
        if (secunde == 60) { System.out.println("60"); }
        if (secunde == 20) { System.out.println("20"); }
        else { System.out.println("altceva"); }
    }
}
```

Problema: fiecare **if** este independent. **else**-ul de la final aparține doar **ultimului if**. Așadar pentru **secunde = 60**, al treilea if eșuează (60 != 20), iar **else**-ul intră în acțiune afișând **"60 de secunde nu au niciun efect"**, ceea ce e greșit — am tratat deja 60 mai sus!

**Regulă practică**: când testăm **aceeași variabilă** pentru mai multe valori, **înlănțuim** cu **if / else if / else**

---

Putem de asemenea **imbrica** if-uri unul în altul

```java
public class Main {
    public static void main(String[] args) {
        int secunde = 5;
        boolean eroareDetectata = false;

        if (secunde < 10) {
            if (eroareDetectata) {
                System.out.println("Eroare detectata. Anulez misiunea");
            } else {
                System.out.println("Nicio eroare detectata. Decolez...");
            }
        }
    }
}
```

Aici, doar **dacă** suntem în ultimele 10 secunde, verificăm indicatorul de eroare. **if**-urile imbricate sunt în regulă, dar dacă imbrici pe 5 niveluri adâncime, codul devine ilizibil. Încearcă să păstrezi lucrurile plate când poți

---

## Misiune: Secvența de Lansare

Cronometrul de numărătoare inversă rulează. În funcție de câte secunde rămân până la lansare, sistemul execută o acțiune diferită:

- la **100** de secunde → afișează `Pornesc toate calculatoarele de la bord`
- la **60** de secunde → afișează `Verific conexiunea cu turnul de control`
- la **20** de secunde → afișează `Pornesc motoarele secundare`
- la **10** secunde → afișează `Pornesc motoarele principale`
- în orice alt caz → afișează `Astept...`

Reține numărul de secunde într-o variabilă `int` numită `secunde` și scrie un lanț `if / else if / else` care afișează acțiunea corectă.

**Exemple**

La `100` de secunde:

```text
Pornesc toate calculatoarele de la bord
```

La `60` de secunde:

```text
Verific conexiunea cu turnul de control
```

La `200` de secunde (nicio ramură nu se potrivește, intră `else`):

```text
Astept...
```
