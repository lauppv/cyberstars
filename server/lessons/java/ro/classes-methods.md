Știi cum să scrii metode cu `static` — acelea aparțin clasei în sine. Dar când construiești obiecte, de obicei vrei metode care aparțin **fiecărui obiect**. Acestea se numesc **metode de instanță** și nu folosesc cuvântul cheie `static`

---

## Metode de Instanță

```java
class Caine {
    String nume;

    Caine(String nume) {
        this.nume = nume;
    }

    void latra() {
        System.out.println(nume + " spune: Ham!");
    }
}

public class Main {
    public static void main(String[] args) {
        Caine c1 = new Caine("Rex");
        Caine c2 = new Caine("Buddy");
        c1.latra();
        c2.latra();
    }
}
```

Output

```text
Rex spune: Ham!
Buddy spune: Ham!
```

Observă: `latra()` **nu are** cuvântul cheie `static`. Asta pentru că este o metodă de instanță — operează pe un câine specific. Când apelezi `c1.latra()`, Java știe că `nume` se referă la numele lui `c1`

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

Fiecare apel la `completeazaMisiune()` modifică câmpul `respect` al **acelui obiect specific**. Dacă am avea un alt `MembruGasca`, respectul lui ar fi separat

---

## Static vs Instanță — Diferența Cheie

Iată regula:

- **Metodele statice** aparțin **clasei**. Le apelezi cu numele clasei: `Math.max(5, 10)`
- **Metodele de instanță** aparțin unui **obiect**. Le apelezi pe o variabilă: `tommy.completeazaMisiune()`

Metodele statice nu pot accesa câmpuri de instanță (pentru că nu există niciun obiect). Metodele de instanță pot accesa orice

```java
class Exemplu {
    int x = 10;          // câmp de instanță

    void arata() {       // metodă de instanță — poate folosi x
        System.out.println(x);
    }

    static void saluta() { // metodă statică — NU poate folosi x
        System.out.println("Salut");
        // System.out.println(x);  // EROARE! Niciun obiect, niciun x
    }
}
```

De aceea `main` este `static` — rulează înainte să existe orice obiect. Este punctul de pornire, și de acolo creezi obiecte și apelezi metodele lor

---

## Comparație cu Python

În Python, metodele de instanță iau `self` ca primul parametru:

```python
class Caine:
    def latra(self):
        print(f"{self.nume} spune: Ham!")
```

În Java, `this` este mereu disponibil înăuntrul metodelor de instanță — nu trebuie să-l listezi ca parametru. Și ai nevoie de `this.` doar când există un conflict de denumire

---

## Misiune: Contor Doc de Andocare

Docul de andocare al stației are nevoie de un contor digital care să țină evidența câte nave au sosit în timpul fiecărei ture. De fiecare dată când o navă andochează, contorul crește cu unu.

Creează o clasă `Contor` cu:

1. Un câmp `int` numit `numar`, începând de la 0
2. Un constructor care setează `numar` la 0
3. O metodă `increment()` care adaugă 1 la `numar`
4. O metodă `getNumar()` care returnează `numar`-ul curent

În `main`, creează un `Contor`, apelează `increment()` de trei ori (trei nave au andocat), apoi afișează numărul.

**Exemplu**

După trei andocări, programul tău ar trebui să afișeze

```text
3
```
