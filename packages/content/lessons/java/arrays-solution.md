```java
public class Main {
    public static void main(String[] args) {
        int[] takings = { 1200, 3400, 800, 2600 };

        int total = 0;
        for (int amount : takings) {
            System.out.println(amount);
            total = total + amount;
        }

        System.out.println(total);

        double average = (double) total / takings.length;
        System.out.println(average);
    }
}
```
