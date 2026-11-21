```java
import java.util.ArrayList;

record Masina(String model, int pret) {
}

interface Pretuire {
    int pretFinal(int pret);
}

class Showroom {
    ArrayList<Masina> masini = new ArrayList<>();

    void adauga(Masina masina) {
        masini.add(masina);
    }

    Masina vinde(String model) {
        for (int i = 0; i < masini.size(); i++) {
            if (masini.get(i).model().equals(model)) {
                return masini.remove(i);
            }
        }
        return null;
    }

    int valoare() {
        int total = 0;
        for (Masina masina : masini) {
            total += masina.pret();
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] modele = { "Infernus", "Cheetah", "Infernus" };
        int[] preturi = { 1000, 800, 900 };
        String[] comenzi = { "Infernus", "Banshee" };
        int reducere = 10;

        Showroom showroom = new Showroom();
        for (int i = 0; i < modele.length; i++) {
            showroom.adauga(new Masina(modele[i], preturi[i]));
        }
        Pretuire oferta = new Pretuire() {
            public int pretFinal(int pret) {
                return pret * (100 - reducere) / 100;
            }
        };
        for (String model : comenzi) {
            Masina masina = showroom.vinde(model);
            if (masina == null) {
                System.out.println(model + ": nu e in stoc");
            } else {
                System.out.println("Vandut " + model + " cu " + oferta.pretFinal(masina.pret()));
            }
        }
        System.out.println("Ramase: " + showroom.masini);
        System.out.println("Valoarea stocului: " + showroom.valoare());
    }
}
```
