```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] timpi = { 61, 58, 70, 55 };

        int[] sortati = Arrays.copyOf(timpi, timpi.length);
        Arrays.sort(sortati);
        int[] podium = Arrays.copyOf(sortati, Math.min(3, sortati.length));
        System.out.println("Ordinea de start: " + Arrays.toString(timpi));
        System.out.println("Sortati: " + Arrays.toString(sortati));
        System.out.println("Podium: " + Arrays.toString(podium));
    }
}
```
