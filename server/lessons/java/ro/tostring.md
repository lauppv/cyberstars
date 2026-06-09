Ce se întâmplă când încerci să afișezi un obiect direct?

```java
class Masina {
    String marca;
    int an;

    Masina(String marca, int an) {
        this.marca = marca;
        this.an = an;
    }
}

public class Main {
    public static void main(String[] args) {
        Masina c = new Masina("Infernus", 1986);
        System.out.println(c);
    }
}
```

Output

```text
Masina@6d06d69c
```

Asta este... deloc util. Java nu știe cum vrei să fie afișat obiectul tău, așa că îți dă numele clasei și o adresă din memorie. Ca să reparăm asta, **suprascriem** (override) o metodă specială numită `toString()`

---

## Suprascrierea lui toString()

Fiecare obiect din Java are o metodă `toString()` (moștenită de la o clasă de bază numită `Object`). În mod implicit afișează acea aiureală urâtă. Dar poți să o **suprascrii** — să scrii propria ta versiune:

```java
class Masina {
    String marca;
    int an;

    Masina(String marca, int an) {
        this.marca = marca;
        this.an = an;
    }

    @Override
    public String toString() {
        return marca + " (" + an + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Masina c = new Masina("Infernus", 1986);
        System.out.println(c);
    }
}
```

Output

```text
Infernus (1986)
```

Acum, când afișezi obiectul, Java apelează `toString()`-ul tău și folosește orice string întorci

---

## Adnotarea @Override

Acel `@Override` de deasupra metodei este o **adnotare**. Îi spune lui Java "înlocuiesc intenționat o metodă din clasa părinte". Este opțional, dar puternic recomandat pentru că:

- Dacă scrii din greșeală metoda greșit (cum ar fi `tostring()` cu S mic), Java îți va da o eroare în loc să creeze pe tăcute o metodă nouă care nu face nimic
- Face codul tău mai clar pentru oricine îl citește

```java
public class Main {
    @Override
    public String toString() {   // Java verifică: are părintele toString()? Da. Bun.
        return "something";
    }
}
```

---

## toString() Este Apelat Automat

Java apelează `toString()` automat în mai multe situații:

```java
class Arma {
    String nume;
    int daune;

    Arma(String nume, int daune) {
        this.nume = nume;
        this.daune = daune;
    }

    @Override
    public String toString() {
        return nume + " (daune: " + daune + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Arma w = new Arma("Katana", 75);

        // Toate acestea apelează toString() automat:
        System.out.println(w);                    // afișare directă
        System.out.println("Arma: " + w);         // concatenare de string-uri
        String s = "Am primit o " + w;             // construirea unui string
        System.out.println(s);
    }
}
```

Output

```text
Katana (daune: 75)
Arma: Katana (daune: 75)
Am primit o Katana (daune: 75)
```

Oricând Java are nevoie să transforme obiectul tău într-un `String`, apelează `toString()`. Concatenarea cu `+` face asta, `println()` face asta — e peste tot

---

## Comparație cu Python

În Python, echivalentul este `__str__`:

```python
class Car:
    def __str__(self):
        return f"{self.make} ({self.year})"
```

Aceeași idee — Java doar o numește `toString()` și folosește `@Override` în loc de metode dunder

---

## Un Exemplu Mai Detaliat

Echipa lui Tommy Vercetti are nevoie de reprezentări de string corespunzătoare:

```java
class MembruBanda {
    String nume;
    String rol;
    int respect;

    MembruBanda(String nume, String rol, int respect) {
        this.nume = nume;
        this.rol = rol;
        this.respect = respect;
    }

    @Override
    public String toString() {
        return nume + " - " + rol + " (Respect: " + respect + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        MembruBanda t = new MembruBanda("Tommy Vercetti", "Sef", 100);
        MembruBanda l = new MembruBanda("Lance Vance", "Partener", 60);
        System.out.println(t);
        System.out.println(l);
    }
}
```

Output

```text
Tommy Vercetti - Sef (Respect: 100)
Lance Vance - Partener (Respect: 60)
```

---

## Misiune: Manifestul Flotei

Hangarul stației are nevoie de un sistem de afișare pentru flota sa de vehicule. Fiecare vehicul ar trebui să-și afișeze propriul rezumat formatat când este înregistrat în consolă — fără construire manuală de string-uri.

Creează o clasă `Masina` cu câmpurile `marca` (String) și `an` (int). Scrie un constructor și suprascrie `toString()` ca să întoarcă formatul `Marca (An)`.

În `main`, creează două vehicule și afișează-le direct:

1. `"Infernus"`, anul `1986`
2. `"Cheetah"`, anul `1984`

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"Infernus"` / `1986` — primul vehicul
- `"Cheetah"` / `1984` — al doilea vehicul

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Infernus (1986)
Cheetah (1984)
```
