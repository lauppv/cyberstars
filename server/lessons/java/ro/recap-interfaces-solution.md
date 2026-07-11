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
        String nume1 = "Malibu Club";
        int valoare1 = 120000;
        String nume2 = "Infernus";
        int valoare2 = 150000;
        int viteza2 = 240;
        String nume3 = "Print Works";
        int valoare3 = 70000;
        String nume4 = "Cheetah";
        int valoare4 = 110000;
        int viteza4 = 230;
        Bun[] bunuri = {
            new Afacere(nume1, valoare1, Stare.ACTIV),
            new Vehicul(nume2, valoare2, Stare.ACTIV, viteza2),
            new Afacere(nume3, valoare3, Stare.RENOVARE),
            new Vehicul(nume4, valoare4, Stare.INCHIS, viteza4)
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
