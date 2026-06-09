Imaginează-ți că programezi un sistem de misiuni Vice City și trebuie să reprezinți **vremea** curentă: însorit, ploios, cu ceață sau furtună. Ai _putea_ folosi String-uri precum `"sunny"` și `"rainy"`, dar atunci cineva ar putea scrie din greșeală `"suny"` și codul tău nu ar prinde greșeala decât la rulare. Aici intervin **enum-urile**

Un **enum** (prescurtare de la enumerare) este un tip special care reprezintă un **set fix de valori cu nume**. Odată ce le definești, acelea sunt SINGURELE opțiuni valide

```java
enum Vreme {
    INSORIT, PLOIOS, CETOS, FURTUNOS
}

public class Main {
    public static void main(String[] args) {
        Vreme azi = Vreme.INSORIT;
        System.out.println("Vremea de azi: " + azi);
    }
}
```

Output

```text
Vremea de azi: INSORIT
```

Prin convenție, valorile enum se scriu cu **MAJUSCULE_CU_UNDERSCORE**. Le accesezi cu numele enum-ului, un punct, apoi valoarea: `Vreme.INSORIT`

---

Python nu are enum-uri integrate în limbaj în același mod (există un modul `enum`, dar majoritatea începătorilor nu-l folosesc niciodată). În Python, probabil ai folosi pur și simplu string-uri sau constante. Abordarea din Java este **mai sigură** pentru că compilatorul verifică să folosești doar valori valide

```java
public class Main {
    public static void main(String[] args) {
        Vreme w = Vreme.PLOIOS;    // funcționează
        Vreme w = Vreme.NINSOARE;    // EROARE — NINSOARE nu există în Vreme
    }
}
```

Compilatorul îți prinde greșeala înainte ca programul să ruleze măcar. Asta e una dintre acele superputeri Java care te salvează de bug-uri perfide

---

Enum-urile funcționează minunat cu instrucțiunile **switch**. Fiecare caz se ocupă de o valoare posibilă

```java
enum Arma {
    PISTOL, PUSCA, LANSATOR_RACHETE, KATANA
}

public class Main {
    public static void descrieArma(Arma a) {
        switch (a) {
            case PISTOL:
                System.out.println("O armă de încredere. Daune mici, precizie mare.");
                break;
            case PUSCA:
                System.out.println("Devastatoare de aproape. Preferata lui Tommy.");
                break;
            case LANSATOR_RACHETE:
                System.out.println("Exagerare? N-am auzit de așa ceva.");
                break;
            case KATANA:
                System.out.println("Silențioasă și letală. Stil samurai.");
                break;
        }
    }

    public static void main(String[] args) {
        descrieArma(Arma.PUSCA);
        descrieArma(Arma.KATANA);
    }
}
```

Output

```text
Devastatoare de aproape. Preferata lui Tommy.
Silențioasă și letală. Stil samurai.
```

Observă: în interiorul switch-ului, scrii doar `PISTOL`, nu `Arma.PISTOL`. Java știe deja că faci switch pe un `Arma`, așa că te lasă să sari peste prefix

---

Poți parcurge **toate valorile** unui enum folosind metoda **values()**

```java
enum Gasca {
    VERCETTI, CUBANS, HAITIANS, BIKERS
}

public class Main {
    public static void main(String[] args) {
        for (Gasca g : Gasca.values()) {
            System.out.println(g);
        }
    }
}
```

Output

```text
VERCETTI
CUBANS
HAITIANS
BIKERS
```

`Gasca.values()` returnează un array cu toate constantele enum în ordinea în care au fost declarate. Super util când vrei să procesezi fiecare opțiune

---

Când ar trebui să folosești enum-uri în loc de String-uri?

- **Folosește enum-uri** când ai un **set fix și cunoscut** de opțiuni: zilele săptămânii, anotimpurile, nivelurile de dificultate, stările jocului (MENU, PLAYING, PAUSED, GAME_OVER)
- **Folosește String-uri** când valoarea e **liberă** sau provine de la utilizator: nume de jucători, mesaje, căi de fișiere

Dacă te trezești scriind `if (status.equals("active") || status.equals("inactive") || ...)` — acesta e un semn că probabil vrei un enum

---

## Misiune: Modulul de Control al Climei

Stația orbitează în jurul unei planete cu patru cicluri climatice distincte. Sistemele de mediu au nevoie de un raport de stare pentru fiecare anotimp, ca echipajul să știe la ce să se aștepte în misiunile de la suprafață.

Creează un enum numit `Anotimp` cu patru valori: `PRIMAVARA`, `VARA`, `TOAMNA`, `IARNA`. Scrie o metodă statică `descrieAnotimp(Anotimp a)` care afișează o descriere pentru fiecare:

1. PRIMAVARA: `"Primavara: florile înfloresc"`
2. VARA: `"Vara: timpul pentru plajă"`
3. TOAMNA: `"Toamna: cad frunzele"`
4. IARNA: `"Iarna: stai în casă și programează"`

În `main`, parcurge **toate** anotimpurile folosind `Anotimp.values()` și apelează `descrieAnotimp` pentru fiecare.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Primavara: florile înfloresc
Vara: timpul pentru plajă
Toamna: cad frunzele
Iarna: stai în casă și programează
```
