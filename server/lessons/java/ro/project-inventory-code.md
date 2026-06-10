import java.util.ArrayList;

class Articol {
    String nume;
    int cantitate;
    double pret;
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
    }

    void afiseazaTot() {
    }

    double valoareTotala() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventar inv = new Inventar();
    }
}
