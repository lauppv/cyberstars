```java
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
        tinta.viata -= this.putereAtac;
        System.out.println(this.nume + " ataca " + tinta.nume + " cu " + this.putereAtac + " daune!");
    }

    void afiseazaStatus() {
        System.out.println(this.nume + " - HP: " + this.viata);
    }
}

class Razboinic extends Personaj {
    int armura;

    Razboinic(String nume, int viata, int putereAtac, int armura) {
        super(nume, viata, putereAtac);
        this.armura = armura;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac;
        tinta.viata -= daune;
        System.out.println(this.nume + " loveste cu sabia pe " + tinta.nume + " cu " + daune + " daune!");
    }
}

class Mag extends Personaj {
    int putereVraja;

    Mag(String nume, int viata, int putereAtac, int putereVraja) {
        super(nume, viata, putereAtac);
        this.putereVraja = putereVraja;
    }

    void ataca(Personaj tinta) {
        int daune = this.putereAtac + this.putereVraja;
        tinta.viata -= daune;
        System.out.println(this.nume + " lanseaza o vraja asupra lui " + tinta.nume + " cu " + daune + " daune!");
    }
}

public class Main {
    public static void main(String[] args) {
        Razboinic w = new Razboinic("Tommy", 100, 25, 10);
        Mag m = new Mag("Lance", 80, 15, 20);

        w.ataca(m);
        m.afiseazaStatus();

        m.ataca(w);
        w.afiseazaStatus();
    }
}
```
