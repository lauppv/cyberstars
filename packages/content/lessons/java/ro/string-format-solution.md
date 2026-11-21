```java
public class Main {
    public static void main(String[] args) {
        String[] nume = { "Tommy", "Lance", "Ken" };
        int[] bani = { 1500000, 25000, 980 };

        int total = 0;
        for (int i = 0; i < nume.length; i++) {
            System.out.println(String.format("%-10s%,12d", nume[i], bani[i]));
            total += bani[i];
        }
        System.out.println(String.format("%-10s%,12d", "TOTAL", total));
    }
}
```
