```java
import java.util.Random;
import java.util.Scanner;

class Dice {
    private final int sides;
    private final Random random;

    Dice(int sides, long seed) {
        this.sides = sides;
        this.random = new Random(seed);
    }

    int roll() {
        return random.nextInt(sides) + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int sides = Integer.parseInt(sc.nextLine());
        long seed = Long.parseLong(sc.nextLine());
        int rolls = Integer.parseInt(sc.nextLine());

        Dice dice = new Dice(sides, seed);

        for (int i = 0; i < rolls; i++) {
            System.out.println(dice.roll());
        }
    }
}
```
