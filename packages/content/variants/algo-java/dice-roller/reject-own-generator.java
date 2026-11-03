import java.util.Scanner;

class Generator {
    private long seed;

    Generator(long seed) {
        this.seed = (seed ^ 0x5DEECE66DL) & ((1L << 48) - 1);
    }

    int next(int bits) {
        seed = (seed * 0x5DEECE66DL + 0xBL) & ((1L << 48) - 1);
        return (int) (seed >>> (48 - bits));
    }

    int nextInt(int bound) {
        int r = next(31);
        int m = bound - 1;
        if ((bound & m) == 0) return (int) ((bound * (long) r) >> 31);
        for (int u = r; u - (r = u % bound) + m < 0; u = next(31)) {
        }
        return r;
    }
}

class Dice {
    private final int sides;
    private final Generator generator;

    Dice(int sides, long seed) {
        this.sides = sides;
        this.generator = new Generator(seed);
    }

    int roll() {
        return generator.nextInt(sides) + 1;
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
