Polimorfismul este un cuvânt sofisticat care înseamnă „multe forme." În Java, înseamnă că o variabilă de tip **părinte** poate conține un obiect de orice tip **copil** — și Java va apela metoda CORECTĂ automat

```java
class Animal {
    String nume;
    Animal(String nume) { this.nume = nume; }
    void vorbeste() { System.out.println("..."); }
}

class Caine extends Animal {
    Caine(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Ham!"); }
}

class Pisica extends Animal {
    Pisica(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Miau!"); }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Caine("Rex");  // tip părinte, obiect copil
        a.vorbeste();  // afișează "Ham!" nu "..."
    }
}
```

Chiar dacă `a` este declarat ca `Animal`, Java știe că este de fapt un `Caine` la rulare și apelează `vorbeste()` al lui Caine. Asta se numește **dynamic dispatch** — Java direcționează apelul de metodă către tipul real al obiectului, nu către tipul declarat

---

Asta devine CU ADEVĂRAT puternic cu array-uri și bucle. Imaginează-ți că construiești un joc ca GTA Vice City și ai diferite tipuri de personaje — toate extinzând o clasă de bază `Personaj`. Le poți stoca pe toate într-UN SINGUR array

```java
class Forma {
    double arie() { return 0; }
}

class Cerc extends Forma {
    double raza;
    Cerc(double raza) { this.raza = raza; }

    @Override
    double arie() { return Math.PI * raza * raza; }
}

class Dreptunghi extends Forma {
    double latime, inaltime;
    Dreptunghi(double latime, double inaltime) { this.latime = latime; this.inaltime = inaltime; }

    @Override
    double arie() { return latime * inaltime; }
}

public class Main {
    public static void main(String[] args) {
        Forma[] forme = { new Cerc(5), new Dreptunghi(4, 6) };

        for (Forma f : forme) {
            System.out.println(f.arie());
        }
    }
}
```

Output

```text
78.53981633974483
24.0
```

Nu am verificat niciodată „este asta un cerc sau un dreptunghi?" — Java și-a dat seama pentru noi. Bucla doar apelează `f.arie()` și Java o direcționează către override-ul corect. Asta este polimorfismul în acțiune

---

În Python asta funcționează și (duck typing), dar Java o face cu **siguranță de tip**. Compilatorul garantează că fiecare obiect din acel array `Forma[]` are o metodă `arie()`. Niciun `AttributeError` surpriză la rulare

---

Uneori trebuie să verifici ce tip este de fapt un obiect. Java are cuvântul cheie **instanceof** pentru asta

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Caine("Rex");

        if (a instanceof Caine) {
            System.out.println("Este un câine!");
        }
    }
}
```

Asta este util când trebuie să accesezi metode specifice copilului. Dar în general, dacă folosești `instanceof` mult, s-ar putea să te lupți împotriva polimorfismului în loc să-l folosești. Tot ideea este să NU-ți pese de tipul specific

---

Iată de ce contează asta în cod real. Imaginează-ți o metodă care primește orice Forma

```java
public class Main {
    static void afiseazaArie(Forma f) {
        System.out.println("Arie: " + f.arie());
    }
}
```

Poți trece un Cerc, un Dreptunghi, un Triunghi — orice extinde Forma. Metodei nu trebuie să-i pese sau să știe. Asta e puterea. O singură metodă tratează TOATE formele, actuale și viitoare

Ca Cortez în Vice City — el dă misiuni lui Tommy, Lance, oricui. Nu-i pasă de persoana specifică, doar că își pot face treaba. „Treaba" este semnătura metodei, iar polimorfismul se asigură că persoana potrivită o face în felul ei

---

## Misiune: Auditul Calei de Marfă

Cala de marfă a stației conține containere de forme diferite. Cartnicul are nevoie de o singură buclă care calculează și afișează aria amprentei fiecărui container — fără să verifice ce formă are fiecare.

Creează clasele `Forma`, `Cerc` și `Dreptunghi` (Forma are `arie()` care întoarce 0; Cerc face override cu `Math.PI * raza * raza`; Dreptunghi face override cu `latime * inaltime`).

În `main`, creează un array `Forma[]` care conține un Cerc cu raza `5` și un Dreptunghi cu lățimea `4` și înălțimea `6`. Parcurge array-ul și afișează fiecare arie folosind `String.format("%.2f", f.arie())`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `5` — raza cercului
- `4`, `6` — lățimea și înălțimea dreptunghiului

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
78.54
24.00
```
