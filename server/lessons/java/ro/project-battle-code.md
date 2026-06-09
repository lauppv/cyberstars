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
    }

    void afiseazaStatus() {
    }
}

class Razboinic extends Personaj {
    int armura;

    Razboinic(String nume, int viata, int putereAtac, int armura) {
        super(nume, viata, putereAtac);
        this.armura = armura;
    }
}

class Mag extends Personaj {
    int putereVraja;

    Mag(String nume, int viata, int putereAtac, int putereVraja) {
        super(nume, viata, putereAtac);
        this.putereVraja = putereVraja;
    }
}

public class Main {
    public static void main(String[] args) {
    }
}
