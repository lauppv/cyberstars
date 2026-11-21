class Pair {
    Object first;
    Object second;

    Pair(Object first, Object second) { this.first = first; this.second = second; }
    Object first() { return first; }
    Object second() { return second; }
    Pair swap() { return new Pair(second, first); }
    public String toString() { return "(" + first + ", " + second + ")"; }
}

public class Main {
    public static void main(String[] args) {
        String name = "Tommy";
        int score = 120;
        Pair pair = new Pair(name, score);
        System.out.println(pair);
        System.out.println(pair.swap());
        System.out.println(pair.first() + " has " + pair.second() + " points");
    }
}
