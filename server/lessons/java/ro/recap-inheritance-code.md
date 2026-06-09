abstract class Vehicul {
    // câmpuri, constructor, metode abstracte, condu, toString
}

class Masina extends Vehicul {
    // implementează
    Masina(String nume) { super(nume); }
}

class Camion extends Vehicul {
    Camion(String nume) { super(nume); }
}

class Motocicleta extends Vehicul {
    Motocicleta(String nume) { super(nume); }
}

public class Main {
    public static void main(String[] args) {
        Vehicul[] flota = {
            new Masina("BMW"),
            new Camion("Volvo"),
            new Motocicleta("Harley")
        };

        for (Vehicul v : flota) {
            v.condu(15);
        }

        flota[1].condu(20);

        for (Vehicul v : flota) {
            System.out.println(v);
        }
    }

}
