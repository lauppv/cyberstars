```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] preturi = {32000, 120000, 9000, 45000, 60000, 32000};
        int buget = 50000;

        ArrayList<Integer> masini = new ArrayList<>();
        for (int pret : preturi) {
            masini.add(pret);
        }

        masini.removeIf(p -> p > buget);
        masini.sort((a, b) -> b - a);
        masini.forEach(p -> System.out.println("$" + p));
        System.out.println("Opțiuni: " + masini.size());
    }
}
```
