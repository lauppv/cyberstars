Când creezi un obiect nou, Java apelează o metodă specială numită **constructor**. Este codul care rulează **la naștere** — pregătind obiectul înainte ca cineva să-l poată folosi

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

Output

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

E ca și cum ai spune "numele **acestui** obiect este egal cu numele pe care mi l-ai dat"

```java
public class Main {
    public static void main(String[] args) {
        Jucator(String nume, int scor) {
            this.nume = nume;     // numele obiectului = parametrul nume
            this.scor = scor;   // scorul obiectului = parametrul scor
        }
    }
}
```

Dacă parametrul ar avea un nume diferit, nici nu ai avea nevoie de `this`:

```java
public class Main {
    public static void main(String[] args) {
        Jucator(String n, int s) {
            nume = n;    // nicio confuzie, deci "this" e opțional
            scor = s;
        }
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
        Inamic e = new Inamic();   // funcționează! Java a făcut un constructor implicit
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
        // Inamic e = new Inamic();  // EROARE! Nu mai există constructor fără argumente
        Inamic e = new Inamic("Goon");  // Asta funcționează
        System.out.println(e.tip);
        System.out.println(e.viata);
    }
}
```

Output

```text
Goon
50
```

---

## Constructori Multipli

Poți avea mai mult de un constructor — atâta timp cât primesc parametri diferiți. Asta se numește **suprasolicitare** (overloading):

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
        this.dauna = 10;  // dauna implicită
    }
}

public class Main {
    public static void main(String[] args) {
        Arma a1 = new Arma("Katana", 75);
        Arma a2 = new Arma("Fists");
        System.out.println(a1.nume + " provoacă " + a1.dauna + " daune");
        System.out.println(a2.nume + " provoacă " + a2.dauna + " daune");
    }
}
```

Output

```text
Katana provoacă 75 daune
Fists provoacă 10 daune
```

---

## Comparație cu Python

În Python, constructorul este `__init__` și `self` este pasat explicit:

```python
class Jucator:
    def __init__(self, nume, scor):
        self.nume = nume
        self.scor = scor
```

În Java, numele constructorului se potrivește cu numele clasei, iar `this` este disponibil automat — nu îl pui în lista de parametri

---

## Misiune: Fișa de Scor a Echipajului

Comandantul stației are nevoie de un sistem rapid de fișe de scor pentru a urmări evaluările de performanță ale echipajului după fiecare ciclu de misiune. Fiecare membru al echipajului este înregistrat cu un nume și un scor.

Creează o clasă `Jucator` cu două câmpuri: `nume` (String) și `scor` (int). Scrie un constructor care primește ambele valori și le setează folosind `this`.

În `main`, creează doi jucători:

1. `"Tommy Vercetti"` cu scorul `500`
2. `"Lance Vance"` cu scorul `300`

Afișează fiecare jucător în formatul `Nume are Scor puncte`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"Tommy Vercetti"` / `500` — numele și scorul primului jucător
- `"Lance Vance"` / `300` — numele și scorul celui de-al doilea jucător

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Tommy Vercetti are 500 puncte
Lance Vance are 300 puncte
```
