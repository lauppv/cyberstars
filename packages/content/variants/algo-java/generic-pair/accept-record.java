import java.util.*;

record Pair<A, B>(A first, B second) {
    Pair<B, A> swap() {
        return new Pair<>(second, first);
    }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Pair<String, Integer> p = new Pair<>(in.nextLine().trim(), Integer.parseInt(in.nextLine().trim()));
        System.out.println(p);
        System.out.println(p.swap());
    }
}
