```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;

class Masina {
    String model;
    int an;

    Masina(String model, int an) {
        this.model = model;
        this.an = an;
    }

    @Override
    public boolean equals(Object alta) {
        if (!(alta instanceof Masina)) {
            return false;
        }
        Masina m = (Masina) alta;
        return model.equals(m.model) && an == m.an;
    }

    @Override
    public int hashCode() {
        return Objects.hash(model, an);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] modele = { "Infernus", "Cheetah", "Infernus", "Infernus" };
        int[] ani = { 1986, 1986, 1986, 1985 };

        HashMap<Masina, Integer> numar = new HashMap<>();
        ArrayList<Masina> diferite = new ArrayList<>();
        for (int i = 0; i < modele.length; i++) {
            Masina masina = new Masina(modele[i], ani[i]);
            if (!diferite.contains(masina)) {
                diferite.add(masina);
                numar.put(masina, 1);
            } else {
                numar.put(masina, numar.get(masina) + 1);
            }
        }
        for (Masina masina : diferite) {
            System.out.println(masina.model + " " + masina.an + ": " + numar.get(masina));
        }
        System.out.println("Masini diferite: " + diferite.size());
    }
}
```
