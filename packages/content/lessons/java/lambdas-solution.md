```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] prices = {32000, 120000, 9000, 45000, 60000, 32000};
        int budget = 50000;

        ArrayList<Integer> cars = new ArrayList<>();
        for (int price : prices) {
            cars.add(price);
        }

        cars.removeIf(p -> p > budget);
        cars.sort((a, b) -> b - a);
        cars.forEach(p -> System.out.println("$" + p));
        System.out.println("Options: " + cars.size());
    }
}
```
