wCând creezi un obiect nou, Java apelează o metodă specială numită **constructor**. Este codul care rulează **la naștere** — pregătind obiectul înainte ca cineva să-l poată folosi

Gândește-te așa: când Tommy Vercetti ajunge în Vice City, începe cu un nume, o reputație și poate ceva bani. Constructorul este cel care îi dă acele statistici de start

---

## Primul tău Constructor

```java
class Jucator {
    String nume;
    int scor;

    Jucator(String nume, int scor) {
        this.nume = nume;
        this.scor = scor;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Tommy", 100);
        System.out.println(p.nume);
        System.out.println(p.scor);
    }
}
```

Ieșire

```text
Tommy
100
```

Câteva lucruri de observat:

- Constructorul are **același nume** ca și clasa — `Jucator`
- Nu are **niciun tip de retur**. Nici `void`, nici `int`, literalmente nimic înainte de nume. Așa știe Java că este un constructor și nu o metodă obișnuită
- Folosim `new Jucator("Tommy", 100)` ca să creăm obiectul și să apelăm constructorul în același timp

---

## Cuvântul cheie `this`

Probabil ai remarcat `this.nume = nume` și te-ai întrebat ce se întâmplă. Iată cum stă treaba:

- `nume` (fără `this`) se referă la **parametru** — valoarea pasată
- `this.nume` se referă la **câmpul** de pe obiectul însuși

E ca și cum ai spune „numele **acestui** obiect este egal cu numele pe care mi l-ai dat"

```java
class Jucator {
    String nume;
    int scor;

    Jucator(String nume, int scor) {
        this.nume = nume;     // numele obiectului = parametrul nume
        this.scor = scor;     // scorul obiectului = parametrul scor
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Tommy", 100);
        System.out.println(p.nume + " " + p.scor);
    }
}
```

Dacă parametrul ar avea un nume diferit, nici nu ai avea nevoie de `this`:

```java
class Jucator {
    String nume;
    int scor;

    Jucator(String n, int s) {
        nume = n;    // nicio confuzie, deci "this" e optional
        scor = s;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = new Jucator("Lance", 80);
        System.out.println(p.nume + " " + p.scor);
    }
}
```

Dar folosirea lui `this` este considerată stil bun — îți face intenția clară

---

## Constructorul Implicit

Dacă scrii o clasă **fără niciun constructor**, Java îți oferă unul gratuit, fără parametri:

```java
class Inamic {
    String tip;
    int viata;
}

public class Main {
    public static void main(String[] args) {
        Inamic e = new Inamic();   // merge! Java a facut un constructor implicit
        System.out.println(e.tip);    // null (String-urile pornesc implicit de la null)
        System.out.println(e.viata);  // 0 (int-urile pornesc implicit de la 0)
    }
}
```

Dar în momentul în care scrii tu însuți **orice** constructor, Java nu-ți mai oferă unul gratuit:

```java
class Inamic {
    String tip;
    int viata;

    Inamic(String tip) {
        this.tip = tip;
        this.viata = 50;
    }
}

public class Main {
    public static void main(String[] args) {
        // Inamic e = new Inamic();  // nu compileaza, nu mai exista constructor fara argumente
        Inamic e = new Inamic("Goon");  // asta merge
        System.out.println(e.tip);
        System.out.println(e.viata);
    }
}
```

Ieșire

```text
Goon
50
```

---

## Constructori Multipli

Poți avea mai mult de un constructor — atâta timp cât primesc parametri diferiți. Asta se numește **supraîncărcare** (overloading):

```java
class Arma {
    String nume;
    int dauna;

    Arma(String nume, int dauna) {
        this.nume = nume;
        this.dauna = dauna;
    }

    Arma(String nume) {
        this.nume = nume;
        this.dauna = 10;  // dauna implicita
    }
}

public class Main {
    public static void main(String[] args) {
        Arma a1 = new Arma("Katana", 75);
        Arma a2 = new Arma("Fists");
        System.out.println(a1.nume + " provoaca " + a1.dauna + " daune");
        System.out.println(a2.nume + " provoaca " + a2.dauna + " daune");
    }
}
```

Ieșire

```text
Katana provoaca 75 daune
Fists provoaca 10 daune
```

---

## Misiune: Fișa de Scor a Echipajului

Tommy ține o evidență a echipajului său din Vice City. Fiecare membru este înregistrat cu un nume și un scor — reputația lui pe străzi.

Creează o **clasă** `Jucator` care reprezintă un membru al echipajului, cu un câmp pentru **nume** (String) și unul pentru **scor** (int). Scrie un **constructor** care primește ambele valori și le setează folosind `this`.

În `main`, stochează mai întâi valorile în variabile locale — `nume1` și `scor1` pentru primul membru, `nume2` și `scor2` pentru al doilea. Apoi construiește **doi** membri pasând acele variabile constructorului și afișează fiecare pe linia lui în formatul `Nume are Scor puncte`.

**Exemplu** pentru `Tommy Vercetti` cu scorul `500` și `Lance Vance` cu scorul `300`

```text
Tommy Vercetti are 500 puncte
Lance Vance are 300 puncte
```

**Exemplu** pentru `Diaz` cu scorul `800` și `Cortez` cu scorul `650`

```text
Diaz are 800 puncte
Cortez are 650 puncte
```
