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
        Vehicul[] flota = {
            new Sportiva("Infernus"),
            new Camion("Linerunner"),
            new Motocicleta("Angel")
        };

        flota[0].condu(15);
        flota[1].condu(15);
        flota[1].condu(20);
        flota[2].condu(15);

        for (Vehicul v : flota) {
            System.out.println(v);
        }
    }
}
```
