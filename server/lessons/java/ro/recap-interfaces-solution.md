```java
enum Stare {
    ACTIV, INCHIS, RENOVARE
}

interface Bun {
    void afiseaza();
}

class Afacere implements Bun {
    String nume;
    int valoare;
    Stare stare;

    Afacere(String nume, int valoare, Stare stare) {
        this.nume = nume;
        this.valoare = valoare;
        this.stare = stare;
    }

    public void afiseaza() {
        System.out.println(nume + " - $" + valoare + " - " + stare.name().toLowerCase());
    }
}

class Vehicul implements Bun {
    String nume;
    int valoare;
    Stare stare;
    int vitezaMaxima;

    Vehicul(String nume, int valoare, Stare stare, int vitezaMaxima) {
        this.nume = nume;
        this.valoare = valoare;
        this.stare = stare;
        this.vitezaMaxima = vitezaMaxima;
    }

    public void afiseaza() {
        System.out.println(nume + " - $" + valoare + " - " + stare.name().toLowerCase());
    }
}

public class Main {
    public static void main(String[] args) {
        Bun[] bunuri = {
            new Afacere("Malibu Club", 120000, Stare.ACTIV),
            new Vehicul("Infernus", 150000, Stare.ACTIV, 240),
            new Afacere("Print Works", 70000, Stare.RENOVARE),
            new Vehicul("Cheetah", 110000, Stare.INCHIS, 230)
        };
        for (Bun b : bunuri) {
            b.afiseaza();
            if (b instanceof Vehicul) {
                Vehicul v = (Vehicul) b;
                System.out.println("Viteza maxima: " + v.vitezaMaxima + " km/h");
            }
        }
    }
}
```
