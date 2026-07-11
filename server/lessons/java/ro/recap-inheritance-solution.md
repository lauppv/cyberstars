```java
abstract class Vehicul {
    String nume;
    int combustibil = 100;

    Vehicul(String nume) {
        this.nume = nume;
    }

    abstract String tip();
    abstract int consumPeKm();

    void condu(int km) {
        int necesar = km * consumPeKm();
        if (necesar > combustibil) {
            System.out.println("Combustibil insuficient!");
            return;
        }
        combustibil -= necesar;
    }

    @Override
    public String toString() {
        return nume + " (" + tip() + ") - Combustibil: " + combustibil + "%";
    }
}

class Sportiva extends Vehicul {
    Sportiva(String nume) { super(nume); }
    @Override
    String tip() { return "Sportiva"; }
    @Override
    int consumPeKm() { return 2; }
}

class Camion extends Vehicul {
    Camion(String nume) { super(nume); }
    @Override
    String tip() { return "Camion"; }
    @Override
    int consumPeKm() { return 5; }
}

class Motocicleta extends Vehicul {
    Motocicleta(String nume) { super(nume); }
    @Override
    String tip() { return "Motocicleta"; }
    @Override
    int consumPeKm() { return 1; }
}

public class Main {
    public static void main(String[] args) {
        String nume1 = "Infernus";
        String nume2 = "Linerunner";
        String nume3 = "Angel";
        int km1 = 15;
        int km2 = 15;
        int km3 = 20;
        int km4 = 15;

        Vehicul[] flota = {
            new Sportiva(nume1),
            new Camion(nume2),
            new Motocicleta(nume3)
        };

        flota[0].condu(km1);
        flota[1].condu(km2);
        flota[1].condu(km3);
        flota[2].condu(km4);

        for (Vehicul v : flota) {
            System.out.println(v);
        }
    }
}
```
