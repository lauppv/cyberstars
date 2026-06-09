În Python, dacă voiai o clasă `Caine` care e practic un `Animal` cu extra, scriai `class Caine(Animal):`. Java face același lucru dar folosește cuvântul cheie **extends**

```java
class Animal {
    String nume;

    Animal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }
}

class Caine extends Animal {
    Caine(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Ham! Sunt " + nume);
    }
}
```

Clasa `Caine` **moștenește** totul de la `Animal` — câmpul ei `nume`, logica constructorului, totul. Apoi **suprascrie** metoda `vorbeste()` ca să facă propriul ei lucru. Aceasta este **moștenirea** — una dintre cele mai mari idei din Java

---

Gândește-te la asta ca la GTA Vice City. Tommy Vercetti este un **criminal** (clasa părinte). Lance Vance este și el un criminal, dar este un _tip specific_ — un criminal care te trădează pe la spate. El **extinde** clasa de bază criminal cu propriul lui comportament special (trădarea). El are în continuare toate abilitățile de bază ale unui criminal, plus propria lui răsucire

---

Cuvântul cheie **super** este modul în care un copil vorbește cu părintele lui. Când `Caine` apelează `super(nume)`, spune "hei Animal, rulează constructorul TĂU cu acest nume." Constructorul părinte setează `this.nume = nume`, iar acum câinele are un nume

**Trebuie** să apelezi `super(...)` în constructorul copilului dacă părintele nu are un constructor fără argumente. Java nu te lasă să-l sari — părintele trebuie configurat înainte ca copilul să-și poată adăuga propriile lucruri

```java
class Animal {
    String nume;
    int picioare;

    Animal(String nume, int picioare) {
        this.nume = nume;
        this.picioare = picioare;
    }
}

class Paianjen extends Animal {
    Paianjen(String nume) {
        super(nume, 8);  // păianjenii au mereu 8 picioare
    }
}
```

---

O clasă copil poate de asemenea **adăuga** câmpuri și metode noi pe care părintele nu le are

```java
class Animal {
    String nume;

    Animal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }
}

class Caine extends Animal {
    String rasa;

    Caine(String nume, String rasa) {
        super(nume);
        this.rasa = rasa;
    }

    void vorbeste() {
        System.out.println("Ham! Sunt " + nume);
    }

    void aduMingea() {
        System.out.println(nume + " aduce mingea!");
    }
}
```

Acum `Caine` are tot ce are `Animal`, PLUS un câmp `rasa` și o metodă `aduMingea()`. Părintele `Animal` nu știe despre fetch — acela e propriul lucru al câinelui

---

Iată un exemplu complet care poate fi rulat

```java
class Animal {
    String nume;

    Animal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("Un sunet generic de animal");
    }
}

class Caine extends Animal {
    Caine(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Ham! Mă cheamă " + nume);
    }
}

class Pisica extends Animal {
    Pisica(String nume) {
        super(nume);
    }

    void vorbeste() {
        System.out.println("Miau! Mă cheamă " + nume);
    }
}

public class Main {
    public static void main(String[] args) {
        Caine d = new Caine("Rex");
        Pisica c = new Pisica("Whiskers");
        d.vorbeste();
        c.vorbeste();
    }
}
```

Rezultat

```text
Ham! Mă cheamă Rex
Miau! Mă cheamă Whiskers
```

---

## Misiune: Registrul Animalelor de Companie

Stația le permite membrilor echipajului să aducă la bord animale de companie. Fiecare companion are un nume și poate vocaliza, dar câinii și pisicile o fac diferit. Trebuie să construiești ierarhia de moștenire pentru registru.

Creează o clasă `Animal` cu un câmp `nume`, un constructor și o metodă `vorbeste()` care afișează `"..."`. Apoi creează două clase copil:

1. `Caine` extends `Animal` — suprascrie `vorbeste()` ca să afișeze `"Ham! Mă cheamă "` + nume
2. `Pisica` extends `Animal` — suprascrie `vorbeste()` ca să afișeze `"Miau! Mă cheamă "` + nume

În `main`, creează un `Caine` numit `"Tommy"` și o `Pisica` numită `"Lance"`, și apelează `vorbeste()` pe amândoi.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Ham! Mă cheamă Tommy
Miau! Mă cheamă Lance
```
