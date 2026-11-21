class Pair<A, B> {
    Object first;
    Object second;

    Pair(A first, B second) { this.first = first; this.second = second; }
    Object first() { return first; }
    Object second() { return second; }
    Pair<A, B> swap() {
        Object t = first;
        first = second;
        second = t;
        return this;
    }
    public String toString() { return "(" + first + ", " + second + ")"; }
}

public class Main {
    public static void main(String[] args) {
        String name = "Tommy";
        int score = 120;
        Pair<String, Integer> pair = new Pair<>(name, score);
        System.out.println(pair);
        System.out.println(pair.swap());
        System.out.println(pair.first() + " has " + pair.second() + " points");
    }
}
