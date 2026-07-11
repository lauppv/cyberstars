Java îți permite să ai **mai multe metode cu același nume**, atâta timp cât primesc **parametri diferiți**. Asta se numește **supraîncărcarea metodelor** (method overloading)

Imaginează-ți magazinul de arme al lui Phil Cassidy. Intri și spui „Vreau o armă." Răspunsul lui Phil depinde de **ce informații îi dai**:

- Doar un nume? O ia de pe raft
- Un nume și o cantitate? Îți ia atâtea
- Un nume, o cantitate și un buget? Verifică și prețul

Aceeași cerere („Vreau o armă"), detalii diferite. Asta e supraîncărcarea

```java
public class Main {
    public static void arma(String nume) {
        System.out.println("Arma: " + nume);
    }

    public static void arma(String nume, int numar) {
        System.out.println("Arma: " + nume + " (x" + numar + ")");
    }

    public static void main(String[] args) {
        arma("Shotgun");
        arma("Pistol", 3);
    }
}
```

Ieșire

```text
Arma: Shotgun
Arma: Pistol (x3)
```

Java se uită la **câte argumente** treci și **ce tipuri** au, apoi alege versiunea corectă a metodei. Asta se întâmplă la compilare — Java își dă seama înainte ca programul să ruleze măcar

Hai să urmărim cele două apeluri:

- `arma("Shotgun")` are un singur argument String, deci Java alege prima versiune și afișează `Arma: Shotgun`
- `arma("Pistol", 3)` are un String și un int, deci Java alege a doua versiune și afișează `Arma: Pistol (x3)`

---

Regula cheie: metodele supraîncărcate trebuie să difere prin **lista de parametri**. Asta înseamnă fie un **număr** diferit de parametri, fie **tipuri** diferite

```java
public class Main {
    public static void info(String text) {
        System.out.println("Text: " + text);
    }

    public static void info(int numar) {
        System.out.println("Numar: " + numar);
    }

    public static void info(String text, int numar) {
        System.out.println("Text: " + text + ", Numar: " + numar);
    }

    public static void main(String[] args) {
        info("Tommy");
        info(42);
        info("Lance", 100);
    }
}
```

Ieșire

```text
Text: Tommy
Numar: 42
Text: Lance, Numar: 100
```

Trei metode, toate numite **info**, dar Java știe pe care s-o apeleze în funcție de ce treci

---

Ce **NU** contează ca supraîncărcare? Schimbarea doar a **tipului de retur**

```text
public class Main {
    // Asta NU va compila - aceiasi parametri, tip de retur diferit
    public static int calculeaza(int a) { return a * 2; }
    public static double calculeaza(int a) { return a * 2.0; }
}
```

Java spune: „Dacă cineva apelează **calculeaza(5)**, pe care o aleg?" Nu poate decide doar din tipul de retur, deci asta **nu este permis**

---

Supraîncărcarea este extrem de frecventă în bibliotecile încorporate ale Java. Deja ai folosit-o fără să știi — **System.out.println** este supraîncărcată! Poate primi un String, un int, un double, un boolean... toate versiuni diferite ale aceleiași metode

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("salut");   // println(String)
        System.out.println(42);        // println(int)
        System.out.println(3.14);      // println(double)
        System.out.println(true);      // println(boolean)
    }
}
```

---

## Misiune: Comenzile lui Phil

Phil Cassidy ține evidența comenzilor de arme. Vrea să poată afișa o comandă cu mai mult sau mai puțin detaliu, în funcție de ce informații are

Scrie trei metode supraîncărcate numite `descrie`:

- una care primește doar numele armei și afișează `Arma: ` urmat de nume — de exemplu `Arma: Sniper`
- una care primește numele și câte bucăți se comandă și adaugă numărul urmat de ` arme comandate` — de exemplu `Arma: Sniper - 4 arme comandate`
- una care primește numele, câte bucăți și prețul unei bucăți, calculează totalul (preț ori cantitate) și afișează prețul, cantitatea și totalul — de exemplu `Arma: Sniper - 10$ x 4 arme comandate - 40$`

În `main`, stochează numele armei în `arma`, cantitatea în `cantitate` și prețul unei bucăți în `pret`, apoi fă cele trei apeluri folosind acele variabile: `descrie(arma)`, `descrie(arma, cantitate)` și `descrie(arma, cantitate, pret)`

**Exemplu**

```text
Arma: Sniper
Arma: Sniper - 4 arme comandate
Arma: Sniper - 10$ x 4 arme comandate - 40$
```
