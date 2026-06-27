Știi cum să scrii metode cu `static` — acelea aparțin clasei în sine. Dar când construiești obiecte, de obicei vrei metode care aparțin **fiecărui obiect**. Acestea se numesc **metode de instanță** și nu folosesc cuvântul cheie `static`

---

## Metode de Instanță

```java
class Masina {
    String model;

    Masina(String model) {
        this.model = model;
    }

    void claxoneaza() {
        System.out.println(model + " face: Biiip!");
    }
}

public class Main {
    public static void main(String[] args) {
        Masina m1 = new Masina("Infernus");
        Masina m2 = new Masina("Cheetah");
        m1.claxoneaza();
        m2.claxoneaza();
    }
}
```

Output

```text
Infernus face: Biiip!
Cheetah face: Biiip!
```

Observă: `claxoneaza()` **nu are** cuvântul cheie `static`. Asta pentru că este o metodă de instanță — operează pe o mașină anume. Când apelezi `m1.claxoneaza()`, Java știe că `model` se referă la modelul lui `m1`

---

## Metode Care Returnează Valori

Metodele de instanță pot returna valori la fel ca cele statice:

```java
class Portofel {
    int bani;

    Portofel(int bani) {
        this.bani = bani;
    }

    int getBani() {
        return bani;
    }

    void adaugaBani(int cantitate) {
        bani += cantitate;
    }
}

public class Main {
    public static void main(String[] args) {
        Portofel p = new Portofel(50);
        p.adaugaBani(30);
        System.out.println("Bani: " + p.getBani());
    }
}
```

Output

```text
Bani: 80
```

Șablonul: `void` înseamnă că metoda face ceva, dar nu returnează nimic. Un tip de retur precum `int` înseamnă că returnează o valoare

---

## Metode Care Modifică Obiectul

Aici devine puternic. Metodele pot schimba propriile câmpuri ale obiectului:

```java
class MembruGasca {
    String nume;
    int respect;

    MembruGasca(String nume) {
        this.nume = nume;
        this.respect = 0;
    }

    void completeazaMisiune() {
        respect += 10;
        System.out.println(nume + " a completat o misiune! Respect: " + respect);
    }
}

public class Main {
    public static void main(String[] args) {
        MembruGasca tommy = new MembruGasca("Tommy Vercetti");
        tommy.completeazaMisiune();
        tommy.completeazaMisiune();
        tommy.completeazaMisiune();
    }
}
```

Output

```text
Tommy Vercetti a completat o misiune! Respect: 10
Tommy Vercetti a completat o misiune! Respect: 20
Tommy Vercetti a completat o misiune! Respect: 30
```

Hai să urmărim ce se întâmplă cu `tommy`:

- La creare, constructorul pune `respect` pe `0`
- Primul `completeazaMisiune()`: `respect` crește la `10`, apoi se afișează linia cu `Respect: 10`
- Al doilea apel pleacă de la `10` și ajunge la `20`
- Al treilea pleacă de la `20` și ajunge la `30`

Fiecare apel la `completeazaMisiune()` modifică câmpul `respect` al **acelui obiect specific**. Dacă am avea un alt `MembruGasca`, respectul lui ar fi separat

---

## Static vs Instanță — Diferența Cheie

Iată regula:

- **Metodele statice** aparțin **clasei**. Le apelezi cu numele clasei: `Math.max(5, 10)`
- **Metodele de instanță** aparțin unui **obiect**. Le apelezi pe o variabilă: `tommy.completeazaMisiune()`

Metodele statice nu pot accesa câmpuri de instanță (pentru că nu există niciun obiect). Metodele de instanță pot accesa orice

```java
class Exemplu {
    int x = 10;          // camp de instanta

    void arata() {       // metoda de instanta - poate folosi x
        System.out.println(x);
    }

    static void saluta() { // metoda statica - NU poate folosi x
        System.out.println("Salut");
        // System.out.println(x);  // EROARE! Niciun obiect, niciun x
    }
}
```

De aceea `main` este `static` — rulează înainte să existe orice obiect. Este punctul de pornire, și de acolo creezi obiecte și apelezi metodele lor

---

## Misiune: Încasările Afacerilor

Tommy deține mai multe afaceri în Vice City. Fiecare afacere are un nume și un total de încasări care pornește de la 0. De fiecare dată când afacerea aduce bani, totalul crește

Creează o clasă care reprezintă o afacere, cu un câmp pentru nume și unul pentru totalul încasărilor. Scrie o metodă care adaugă o sumă la total și o metodă care returnează totalul curent

În `main`, creează **două** afaceri cu nume la alegere. Adaugă câteva încasări la fiecare, apoi afișează pentru fiecare afacere numele, apoi `: `, apoi totalul — de exemplu `Malibu Club: 650`

**Exemplu** — `Malibu Club` cu încasările 200, 300, 150 și `Print Works` cu 500, 250

```text
Malibu Club: 650
Print Works: 750
```

**Exemplu** — `Cherry Popper` cu încasările 100, 100 și `Sunshine Autos` cu 1000

```text
Cherry Popper: 200
Sunshine Autos: 1000
```
