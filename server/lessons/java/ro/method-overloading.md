Iată ceva ce Java poate face și Python nu (cel puțin nu nativ): poți avea **mai multe metode cu același nume**, atâta timp cât primesc **parametri diferiți**. Asta se numește **supraîncărcarea metodelor** (method overloading)

Imaginează-ți magazinul de arme al lui Phil Cassidy. Intri și spui „Vreau o armă." Răspunsul lui Phil depinde de **ce informații îi dai**:

- Doar un nume? O ia de pe raft
- Un nume și o cantitate? Îți ia atâtea
- Un nume, o cantitate și un buget? Verifică și prețul

Aceeași cerere („Vreau o armă"), detalii diferite. Asta e supraîncărcarea

```java
public class Main {
    public static void arma(String nume) {
        System.out.println("Armă: " + nume);
    }

    public static void arma(String nume, int numar) {
        System.out.println("Armă: " + nume + " (x" + numar + ")");
    }

    public static void main(String[] args) {
        arma("Shotgun");
        arma("Pistol", 3);
    }
}
```

Output

```text
Armă: Shotgun
Armă: Pistol (x3)
```

Java se uită la **câte argumente** treci și **ce tipuri** au, apoi alege versiunea corectă a metodei. Asta se întâmplă la compilare — Java își dă seama înainte ca programul să ruleze măcar

---

Regula cheie: metodele supraîncărcate trebuie să difere prin **lista de parametri**. Asta înseamnă fie un **număr** diferit de parametri, fie **tipuri** diferite

```java
public class Main {
    public static void info(String text) {
        System.out.println("Text: " + text);
    }

    public static void info(int numar) {
        System.out.println("Număr: " + numar);
    }

    public static void info(String text, int numar) {
        System.out.println("Text: " + text + ", Număr: " + numar);
    }

    public static void main(String[] args) {
        info("Tommy");
        info(42);
        info("Lance", 100);
    }
}
```

Output

```text
Text: Tommy
Număr: 42
Text: Lance, Număr: 100
```

Trei metode, toate numite **info**, dar Java știe pe care s-o apeleze în funcție de ce treci

---

Ce **NU** contează ca supraîncărcare? Schimbarea doar a **tipului de retur**

```java
public class Main {
    // Asta NU va compila — aceiași parametri, tip de retur diferit
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
        System.out.println("hello");   // println(String)
        System.out.println(42);        // println(int)
        System.out.println(3.14);      // println(double)
        System.out.println(true);      // println(boolean)
    }
}
```

---

În Python, dacă ai fi vrut ceva similar, ai fi folosit argumente implicite sau **\*args**. Java nu are **\*args**, așa că supraîncărcarea este modul Java de a trata „aceeași acțiune, intrări diferite"

---

## Misiune: Manifestul de Marfă

Cala de marfă are nevoie de un afișator de inventar. Creează trei metode supraîncărcate numite `descrie` — fiecare afișează un nivel diferit de detaliu în funcție de informația disponibilă:

1. `descrie(String articol)` — afișează `Articol: X`
2. `descrie(String articol, int cantitate)` — afișează `Articol: X (x5)` (unde 5 este cantitatea)
3. `descrie(String articol, int cantitate, double pret)` — afișează `Articol: X (x5) - $P` (unde P este prețul)

Semnăturile metodelor și apelurile sunt deja în dreapta. Completează corpul fiecărei metode.

**Input** (schimbă apelurile din `main` ca să testezi):

- `articol` — numele mărfii
- `cantitate` — câte unități (opțional, a doua supraîncărcare)
- `pret` — prețul pe unitate (opțional, a treia supraîncărcare)

**Exemplu**

Cu apelurile de start, programul tău ar trebui să afișeze

```text
Articol: Sword
Articol: Shield (x5)
Articol: Potion (x3) - $9.99
```
