import java.util.*;

class Die {
    private final Random rng;
    private final int faces;

    Die(int faces, long seed) {
        this.faces = faces;
        rng = new Random(seed);
    }

    int next() {
        return 1 + rng.nextInt(faces);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int sides = in.nextInt();
        long seed = in.nextLong();
        int rolls = in.nextInt();
        Die die = new Die(sides, seed);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < rolls; i++) out.append(die.next()).append('\n');
        System.out.print(out);
    }
}
