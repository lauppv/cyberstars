Polimorfismul este un cuvânt sofisticat care înseamnă „multe forme." În Java, înseamnă că o variabilă de tip **părinte** poate conține un obiect de orice tip **copil** — și Java va apela metoda CORECTĂ automat

```java
class Criminal {
    String nume;
    Criminal(String nume) { this.nume = nume; }
    void vorbeste() { System.out.println("..."); }
}

class Sofer extends Criminal {
    Sofer(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt soferul " + nume); }
}

class Tragator extends Criminal {
    Tragator(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt tragatorul " + nume); }
}

public class Main {
    public static void main(String[] args) {
        Criminal c = new Sofer("Tommy");  // tip parinte, obiect copil
        c.vorbeste();  // afiseaza "Sunt soferul Tommy" nu "..."
    }
}
```

Chiar dacă `c` este declarat ca `Criminal`, Java știe că este de fapt un `Sofer` la rulare și apelează `vorbeste()` al lui Sofer. Asta se numește **dynamic dispatch** — Java direcționează apelul de metodă către tipul real al obiectului, nu către tipul declarat

---

Asta devine CU ADEVĂRAT puternic cu array-uri și bucle. Gândește-te la Vice City: ai diferite tipuri de criminali — toți extinzând clasa de bază `Criminal`. Îi poți stoca pe toți într-UN SINGUR array

```java
class Criminal {
    String nume;
    Criminal(String nume) { this.nume = nume; }
    void vorbeste() { System.out.println("..."); }
}

class Sofer extends Criminal {
    Sofer(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt soferul " + nume); }
}

class Tragator extends Criminal {
    Tragator(String nume) { super(nume); }
    @Override
    void vorbeste() { System.out.println("Sunt tragatorul " + nume); }
}

public class Main {
    public static void main(String[] args) {
        Criminal[] banda = { new Sofer("Tommy"), new Tragator("Lance") };

        for (Criminal c : banda) {
            c.vorbeste();
        }
    }
}
```

Output

```text
Sunt soferul Tommy
Sunt tragatorul Lance
```

Nu am verificat niciodată „este ăsta un șofer sau un trăgător?" — Java și-a dat seama pentru noi. Bucla doar apelează `c.vorbeste()` și Java o direcționează către override-ul corect. Asta este polimorfismul în acțiune

---

Uneori trebuie să verifici ce tip este de fapt un obiect. Java are cuvântul cheie **instanceof** pentru asta

```java
public class Main {
    public static void main(String[] args) {
        Criminal c = new Sofer("Tommy");

        if (c instanceof Sofer) {
            System.out.println("Este un sofer!");
        }
    }
}
```

Asta este util când trebuie să accesezi metode specifice copilului. Dar în general, dacă folosești `instanceof` mult, s-ar putea să te lupți împotriva polimorfismului în loc să-l folosești. Tot ideea este să NU-ți pese de tipul specific

---

Iată de ce contează asta în cod real. Imaginează-ți o metodă care primește orice `Criminal`

```java
public class Main {
    static void prezinta(Criminal c) {
        c.vorbeste();
    }
}
```

Poți trece un Sofer, un Tragator, un Sef — orice extinde Criminal. Metodei nu trebuie să-i pese sau să știe. Asta e puterea. O singură metodă tratează TOȚI criminalii, actuali și viitori

Ca Cortez în Vice City — el dă misiuni lui Tommy, Lance, oricui. Nu-i pasă de persoana specifică, doar că își pot face treaba. „Treaba" este semnătura metodei, iar polimorfismul se asigură că persoana potrivită o face în felul ei

---

## Misiune: Apelul Bandei

Tommy își strigă banda la apel. Fiecare membru răspunde în felul lui, dar tu vrei o singură buclă care îi pune pe toți să vorbească — fără să verifici ce tip e fiecare.

Creează clasele `Criminal`, `Sofer` și `Tragator` (Criminal are `vorbeste()` care afișează „..."; Sofer face override cu „Sunt soferul " + nume; Tragator face override cu „Sunt tragatorul " + nume).

În `main`, creează un array `Criminal[]` care conține un `Sofer` numit `"Tommy"` și un `Tragator` numit `"Lance"`. Parcurge array-ul și apelează `vorbeste()` pe fiecare.

**Exemplu**

```text
Sunt soferul Tommy
Sunt tragatorul Lance
```
