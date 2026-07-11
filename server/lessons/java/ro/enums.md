Imaginează-ți că programezi un sistem de misiuni în Vice City și trebuie să reprezinți **vremea** curentă: însorit, ploios, cu ceață sau furtună. Ai _putea_ folosi String-uri precum `"insorit"` și `"ploios"`, dar cineva ar putea scrie din greșeală `"insort"` și codul tău nu ar prinde greșeala decât la rulare. Aici intervin **enum-urile**

Un **enum** (prescurtare de la enumerare) este un tip special care reprezintă un **set fix de valori cu nume**. Odată ce le definești, acelea sunt singurele opțiuni valide

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

Ieșire

```text
Vremea de azi: INSORIT
```

Prin convenție, valorile enum se scriu cu **MAJUSCULE_CU_UNDERSCORE**. Le accesezi cu numele enum-ului, un punct, apoi valoarea: `Vreme.INSORIT`

---

Dacă încerci să folosești o valoare care nu există în enum, compilatorul oprește totul înainte ca programul să ruleze

```java
enum Vreme {
    INSORIT, PLOIOS, CETOS, FURTUNOS
}

public class Main {
    public static void main(String[] args) {
        Vreme v = Vreme.PLOIOS;     // functioneaza
        Vreme v2 = Vreme.NINSOARE;  // EROARE -- NINSOARE nu exista in Vreme
    }
}
```

Compilatorul prinde greșeala înainte ca programul să pornească. Asta e una dintre superputerile Java

---

Enum-urile funcționează perfect cu instrucțiunile **switch**. Fiecare caz se ocupă de o valoare posibilă

```java
enum Arma {
    PISTOL, PUSCA, AUTOMAT, LANSATOR_RACHETE
}

public class Main {
    public static void descrieArma(Arma a) {
        switch (a) {
            case PISTOL:
                System.out.println("O arma de incredere. Daune mici, precizie mare.");
                break;
            case PUSCA:
                System.out.println("Devastatoare de aproape. Preferata lui Tommy.");
                break;
            case AUTOMAT:
                System.out.println("Rata de foc mare. Bun pentru misiuni intense.");
                break;
            case LANSATOR_RACHETE:
                System.out.println("Exagerare? N-am auzit de asa ceva.");
                break;
        }
    }

    public static void main(String[] args) {
        descrieArma(Arma.PUSCA);
        descrieArma(Arma.AUTOMAT);
    }
}
```

Ieșire

```text
Devastatoare de aproape. Preferata lui Tommy.
Rata de foc mare. Bun pentru misiuni intense.
```

În interiorul switch-ului scrii doar `PISTOL`, nu `Arma.PISTOL` — Java știe deja că faci switch pe un `Arma`, așa că te lasă să sari peste prefix

---

Poți parcurge **toate valorile** unui enum folosind metoda **values()**

```java
enum Gasca {
    VERCETTI, CUBANS, BIKERS, DIAZ
}

public class Main {
    public static void main(String[] args) {
        for (Gasca g : Gasca.values()) {
            System.out.println(g);
        }
    }
}
```

Ieșire

```text
VERCETTI
CUBANS
BIKERS
DIAZ
```

`Gasca.values()` returnează un array cu toate constantele enum în ordinea în care au fost declarate. Util când vrei să procesezi fiecare opțiune

---

Când să folosești enum-uri în loc de String-uri?

- **Enum-uri** — când ai un **set fix și cunoscut** de opțiuni: zilele săptămânii, anotimpurile, nivelurile de dificultate, stările jocului
- **String-uri** — când valoarea e **liberă** sau provine de la utilizator: nume de jucători, mesaje, căi de fișiere

Dacă te trezești scriind `if (status.equals("activ") || status.equals("inactiv") || ...)` — probabil vrei un enum

---

## Misiune: Raportul Afacerilor

Tommy are mai multe afaceri în Vice City și vrea un raport rapid. Fiecare afacere poate fi într-una din câteva stări fixe — produce bani, e închisă temporar, e în renovare sau a fost distrusă de o bandă rivală. De exemplu, Malibu Club merge bine și produce bani, Print Works e în renovare, Boatyard e închis temporar, iar Kaufman Cabs a fost distrus de o bandă rivală

Definește stările posibile ca un set fix de valori (`Stare`). Scrie o metodă `descrieStare` care primește o stare și afișează ce înseamnă. În `main`, stochează cele patru nume de afaceri într-un array `nume` (unul pentru fiecare stare, în **aceeași ordine** ca valorile enum-ului). Apoi parcurge `Stare.values()`; pentru fiecare stare, afișează numele afacerii corespunzătoare urmat de `" - "`, apoi descrie starea.

**Exemplu**

```text
Malibu Club - Activa: produce bani in fiecare zi
Boatyard - Inchisa: nu genereaza venit momentan
Print Works - Renovare: se lucreaza, deschidere in curand
Kaufman Cabs - Distrusa: trebuie reconstruita de la zero
```
