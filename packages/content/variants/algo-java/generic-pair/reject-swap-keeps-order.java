import java.util.*;

class Pair<A, B> {
    private final A first;
    private final B second;

    Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    Pair<A, B> swap() {
        return new Pair<>(first, second);
    }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Pair<String, Integer> p = new Pair<>(in.nextLine(), Integer.parseInt(in.nextLine()));
        System.out.println(p);
        System.out.println(p.swap());
    }
}
