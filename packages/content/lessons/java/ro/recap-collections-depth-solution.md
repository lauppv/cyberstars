```java
import java.util.HashSet;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] sosiri = {"Tommy", "Lance", "Tommy", "Candy", "Lance", "Tommy"};

        HashSet<String> vazuti = new HashSet<>();
        TreeMap<String, Integer> vizite = new TreeMap<>();
        for (String nume : sosiri) {
            if (vazuti.add(nume)) {
                System.out.println("Bine ai venit, " + nume);
            } else {
                System.out.println("Iar aici, " + nume);
            }
            vizite.put(nume, vizite.getOrDefault(nume, 0) + 1);
        }

        System.out.println("Cartea de oaspeti:");
        String fidel = "";
        int maxim = 0;
        for (String nume : vizite.keySet()) {
            int numar = vizite.get(nume);
            System.out.println(nume + ": " + numar);
            if (numar > maxim) {
                maxim = numar;
                fidel = nume;
            }
        }
        System.out.println("Cel mai fidel: " + fidel);
    }
}
```
