```java
import java.util.ArrayList;
import java.util.stream.Collectors;

record Vanzare(String loc, int suma) {}

public class Main {
    public static void main(String[] args) {
        String[] locuri = {"Malibu Club", "Pole Position", "Malibu Club", "Print Works"};
        int[] sume = {5000, 3000, 7000, 1500};

        ArrayList<Vanzare> saptamana = new ArrayList<>();
        for (int i = 0; i < locuri.length; i++) {
            saptamana.add(new Vanzare(locuri[i], sume[i]));
        }

        int total = saptamana.stream().map(Vanzare::suma).reduce(0, Integer::sum);
        int maxim = saptamana.stream().map(Vanzare::suma).reduce(0, Integer::max);
        String nume = saptamana.stream()
            .map(Vanzare::loc)
            .distinct()
            .sorted()
            .collect(Collectors.joining(", "));

        System.out.println("Total: " + total);
        System.out.println("Cea mai mare: " + maxim);
        System.out.println("Locuri: " + nume);
    }
}
```
