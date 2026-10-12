```java
import java.util.Random;
import java.util.Scanner;

class Zar {
    private final int fete;
    private final Random random;

    Zar(int fete, long seed) {
        this.fete = fete;
        this.random = new Random(seed);
    }

    int arunca() {
        return random.nextInt(fete) + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int fete = Integer.parseInt(sc.nextLine());
        long seed = Long.parseLong(sc.nextLine());
        int aruncari = Integer.parseInt(sc.nextLine());

        Zar zar = new Zar(fete, seed);

        for (int i = 0; i < aruncari; i++) {
            System.out.println(zar.arunca());
        }
    }
}
```
