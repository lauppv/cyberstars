```java
import java.util.Random;
import java.util.Scanner;

class Zar {
    private final int fete;
    private final Random generator;

    Zar(int fete, long samanta) {
        this.fete = fete;
        this.generator = new Random(samanta);
    }

    int arunca() {
        return generator.nextInt(fete) + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int fete = Integer.parseInt(sc.nextLine());
        long samanta = Long.parseLong(sc.nextLine());
        int aruncari = Integer.parseInt(sc.nextLine());

        Zar zar = new Zar(fete, samanta);

        for (int i = 0; i < aruncari; i++) {
            System.out.println(zar.arunca());
        }
    }
}
```
