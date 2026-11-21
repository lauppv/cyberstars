```java
import java.util.ArrayList;
import java.util.stream.Collectors;

record Sale(String place, int amount) {}

public class Main {
    public static void main(String[] args) {
        String[] places = {"Malibu Club", "Pole Position", "Malibu Club", "Print Works"};
        int[] amounts = {5000, 3000, 7000, 1500};

        ArrayList<Sale> week = new ArrayList<>();
        for (int i = 0; i < places.length; i++) {
            week.add(new Sale(places[i], amounts[i]));
        }

        int total = week.stream().map(Sale::amount).reduce(0, Integer::sum);
        int biggest = week.stream().map(Sale::amount).reduce(0, Integer::max);
        String names = week.stream()
            .map(Sale::place)
            .distinct()
            .sorted()
            .collect(Collectors.joining(", "));

        System.out.println("Total: " + total);
        System.out.println("Biggest: " + biggest);
        System.out.println("Places: " + names);
    }
}
```
