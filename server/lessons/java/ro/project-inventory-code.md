import java.util.ArrayList;

class Articol {
    String nume;
    int cantitate;
    double pret;

    // Constructor care primește nume, cantitate, pret

}

class Inventar {
    ArrayList<Articol> articole;

    Inventar() {
        articole = new ArrayList<>();
    }

    void adaugaArticol(Articol articol) {
        articole.add(articol);
    }

    void stergeArticol(String nume) {
        // Parcurge articole, găsește după nume, elimină-l

    }

    void afiseazaTot() {
        // Afișează fiecare obiect ca: nume xCantitate @ $pret
        // Folosește String.format("%.2f", pret) pentru preț

    }

    double valoareTotala() {
        // Returnează suma lui cantitate * pret pentru toate obiectele
        return 0;
    }

}

public class Main {
    public static void main(String[] args) {
        Inventar inv = new Inventar();

        // Adaugă: "Shotgun" x2 @ $350.00
        // Adaugă: "Medkit" x10 @ $15.50
        // Adaugă: "Kevlar Vest" x1 @ $200.00

        // Apelează afiseazaTot()
        // Afișează "Total: $" + valoareTotala() formatat

    }

}
