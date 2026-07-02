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
        String[] parts = sc.nextLine().trim().split("\\s+");
        int sides = Integer.parseInt(parts[0]);
        long seed = Long.parseLong(parts[1]);
        int rolls = Integer.parseInt(parts[2]);
        Dice dice = new Dice(sides, seed);
        for (int i = 0; i < rolls; i++) {
            System.out.println(dice.roll());
        }
    }
}
```
