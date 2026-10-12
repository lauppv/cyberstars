```java
import java.util.ArrayList;

class Articol {
    String nume;
    int cantitate;
    double pret;

    Articol(String nume, int cantitate, double pret) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.pret = pret;
    }
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
        for (int i = 0; i < articole.size(); i++) {
            if (articole.get(i).nume.equals(nume)) {
                articole.remove(i);
                return;
            }
        }
    }

    void afiseazaTot() {
        for (Articol articol : articole) {
            System.out.println(articol.nume + " x" + articol.cantitate + " @ $" + String.format("%.2f", articol.pret));
        }
    }

    double valoareTotala() {
        double total = 0;
        for (Articol articol : articole) {
            total += articol.cantitate * articol.pret;
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        String nume1 = "Filtru aer";
        int cantitate1 = 4;
        double pret1 = 35.00;
        String nume2 = "Pachet hrana";
        int cantitate2 = 10;
        double pret2 = 12.00;
        String nume3 = "Kit reparatii";
        int cantitate3 = 3;
        double pret3 = 85.00;

        Inventar inv = new Inventar();
        inv.adaugaArticol(new Articol(nume1, cantitate1, pret1));
        inv.adaugaArticol(new Articol(nume2, cantitate2, pret2));
        inv.adaugaArticol(new Articol(nume3, cantitate3, pret3));

        inv.afiseazaTot();
        System.out.println("Total: $" + String.format("%.2f", inv.valoareTotala()));
    }
}
```
