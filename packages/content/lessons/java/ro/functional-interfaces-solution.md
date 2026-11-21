```java
import java.util.function.Function;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        int[] preturi = {20000, 100000, 50000, 60000};
        int limita = 50000;
        int procent = 20;

        Predicate<Integer> pesteLimita = p -> p > limita;
        Function<Integer, Integer> reducere = p -> p - p * procent / 100;

        int total = 0;
        for (int pret : preturi) {
            if (pesteLimita.test(pret)) {
                int pretNou = reducere.apply(pret);
                System.out.println(pret + " -> " + pretNou);
                total += pretNou;
            } else {
                System.out.println(pret + " ramane");
                total += pret;
            }
        }
        System.out.println("Total: " + total);
    }
}
```
