Uneori vrei o clasă care e practic o altă clasă, dar cu ceva în plus. În Java, o clasă poate **moșteni** de la alta folosind cuvântul cheie **extends**

```text
class Criminal {
    String nume;

    Criminal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }
}

class Sofer extends Criminal {
    Sofer(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Sunt soferul " + nume + ", urca in masina!");
    }
}
```

Clasa `Sofer` **moștenește** totul de la `Criminal` — câmpul ei `nume`, logica constructorului, totul. Apoi **suprascrie** metoda `vorbeste()` ca să facă propriul ei lucru. Aceasta este **moștenirea** — una dintre cele mai mari idei din Java

---

Un exemplu din Vice City: Tommy Vercetti este un **criminal** (clasa părinte). Lance Vance este și el un criminal, dar este un _tip specific_ — un criminal care te trădează pe la spate. El **extinde** clasa de bază criminal cu propriul lui comportament special (trădarea). El are în continuare toate abilitățile de bază ale unui criminal, plus propria lui răsucire

---

Cuvântul cheie **super** este modul în care un copil vorbește cu părintele lui. Când `Sofer` apelează `super(nume)`, spune "hei Criminal, rulează constructorul TĂU cu acest nume." Constructorul părinte setează `this.nume = nume`, iar acum șoferul are un nume

**Trebuie** să apelezi `super(...)` în constructorul copilului dacă părintele nu are un constructor fără argumente. Java nu te lasă să-l sari — părintele trebuie configurat înainte ca copilul să-și poată adăuga propriile lucruri

```text
class Criminal {
    String nume;
    int respect;

    Criminal(String nume, int respect) {
        this.nume = nume;
        this.respect = respect;
    }
}

class Sef extends Criminal {
    Sef(String nume) {
        super(nume, 100);  // un sef porneste mereu cu respect maxim
    }
}
```

---

O clasă copil poate de asemenea **adăuga** câmpuri și metode noi pe care părintele nu le are

```text
class Criminal {
    String nume;

    Criminal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }
}

class Sofer extends Criminal {
    String masina;

    Sofer(String nume, String masina) {
        super(nume);
        this.masina = masina;
    }

    void vorbeste() {
        System.out.println("Sunt soferul " + nume);
    }

    void conduce() {
        System.out.println(nume + " conduce un " + masina + "!");
    }
}
```

Acum `Sofer` are tot ce are `Criminal`, PLUS un câmp `masina` și o metodă `conduce()`. Părintele `Criminal` nu știe despre condus — acela e propriul lucru al șoferului

---

Iată un exemplu complet care poate fi rulat

```java
class Criminal {
    String nume;

    Criminal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("Un criminal oarecare din Vice City");
    }
}

class Sofer extends Criminal {
    Sofer(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Sunt soferul " + nume);
    }
}

class Tragator extends Criminal {
    Tragator(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Sunt tragatorul " + nume);
    }
}

public class Main {
    public static void main(String[] args) {
        Sofer s = new Sofer("Tommy");
        Tragator t = new Tragator("Lance");
        s.vorbeste();
        t.vorbeste();
    }
}
```

Rezultat

```text
Sunt soferul Tommy
Sunt tragatorul Lance
```

---

## Misiune: Banda lui Tommy

Banda lui Tommy are roluri diferite, dar toți sunt criminali. Fiecare se prezintă în felul lui. Construiește ierarhia de moștenire.

Creează o clasă `Criminal` cu un câmp `nume`, un constructor și o metodă `vorbeste()` care afișează `"..."`. Apoi creează două clase copil:

1. `Sofer` extends `Criminal` — suprascrie `vorbeste()` ca să afișeze `"Sunt soferul "` + nume
2. `Tragator` extends `Criminal` — suprascrie `vorbeste()` ca să afișeze `"Sunt tragatorul "` + nume

În `main`, creează un `Sofer` numit `"Tommy"` și un `Tragator` numit `"Lance"`, și apelează `vorbeste()` pe amândoi.

**Exemplu**

```text
Sunt soferul Tommy
Sunt tragatorul Lance
```
