```java
import java.util.ArrayList;

record Masina(String nume, int viteza) {}

public class Main {
    public static void main(String[] args) {
        String[] masini = {"Infernus", "Admiral", "Cheetah", "Banshee", "Faggio"};
        int[] viteze = {240, 150, 230, 230, 90};
        int vitezaMinima = 200;

        ArrayList<Masina> garaj = new ArrayList<>();
        for (int i = 0; i < masini.length; i++) {
            garaj.add(new Masina(masini[i], viteze[i]));
        }

        garaj.stream()
            .filter(m -> m.viteza() >= vitezaMinima)
            .sorted((a, b) -> b.viteza() - a.viteza())
            .map(m -> m.nume() + " (" + m.viteza() + " km/h)")
            .forEach(System.out::println);

        long rapide = garaj.stream().filter(m -> m.viteza() >= vitezaMinima).count();
        System.out.println("Masini rapide: " + rapide);
    }
}
```
