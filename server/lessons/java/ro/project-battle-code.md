class Personaj {
    String nume;
    int viata;
    int putereAtac;

    Personaj(String nume, int viata, int putereAtac) {
        this.nume = nume;
        this.viata = viata;
        this.putereAtac = putereAtac;
    }

    void ataca(Personaj tinta) {
        // Reduce viața țintei cu this.putereAtac
        // Afișează: "NUME atacă TINTA cu DAUNE daune!"

    }

    void afiseazaStatus() {
        // Afișează: "NUME - HP: VIATA"

    }

}

class Razboinic extends Personaj {
    int armura;

    // Constructor: nume, viata, putereAtac, armura
    Razboinic(String nume, int viata, int putereAtac, int armura) {
        super(nume, viata, putereAtac);
        this.armura = armura;
    }

    // Suprascrie ataca: daune = putereAtac
    // Afișează: "NUME lovește cu sabia pe TINTA cu DAUNE daune!"

}

class Mag extends Personaj {
    int putereVraja;

    // Constructor: nume, viata, putereAtac, putereVraja
    Mag(String nume, int viata, int putereAtac, int putereVraja) {
        super(nume, viata, putereAtac);
        this.putereVraja = putereVraja;
    }

    // Suprascrie ataca: daune = putereAtac + putereVraja
    // Afișează: "NUME lansează o vrajă asupra lui TINTA cu DAUNE daune!"

}

public class Main {
    public static void main(String[] args) {
        // Creează Razboinicul "Tommy": viata 100, putereAtac 25, armura 10
        // Creează Mag-ul "Lance": viata 80, putereAtac 15, putereVraja 20

        // Tommy îl atacă pe Lance, afișează statusul lui Lance
        // Lance îl atacă pe Tommy, afișează statusul lui Tommy

    }

}
