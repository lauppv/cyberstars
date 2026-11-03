import java.util.Random;
import java.util.Scanner;

class Dice {
    private final Random random;

    Dice(int sides, long seed) {
        this.random = new Random(seed) {
            @Override
            public long nextLong() {
                int r = next(31);
                int m = sides - 1;
                if ((sides & m) == 0) return (int) ((sides * (long) r) >> 31);
                for (int u = r; u - (r = u % sides) + m < 0; u = next(31)) {
                }
                return r;
            }
        };
    }

    int roll() {
        return (int) random.nextLong() + 1;
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
