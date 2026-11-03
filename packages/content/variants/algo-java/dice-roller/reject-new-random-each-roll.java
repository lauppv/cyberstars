import java.util.*;

class Dice {
    private final int sides;
    private final long seed;

    Dice(int sides, long seed) {
        this.sides = sides;
        this.seed = seed;
    }

    int roll() {
        return new Random(seed).nextInt(sides) + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int sides = Integer.parseInt(in.nextLine());
        long seed = Long.parseLong(in.nextLine());
        int rolls = Integer.parseInt(in.nextLine());
        Dice dice = new Dice(sides, seed);
        for (int i = 0; i < rolls; i++) System.out.println(dice.roll());
    }
}
