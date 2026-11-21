class Pair<A, B> {
    private final A a;
    private final B b;

    Pair(A a, B b) { this.a = a; this.b = b; }

    public A first() { return a; }
    public B second() { return b; }
    public Pair<B, A> swap() { return new Pair<B, A>(b, a); }

    @Override
    public String toString() { return String.format("(%s, %s)", a, b); }
}

public class Main {
    public static void main(String[] args) {
        String name = "Tommy";
        int score = 120;
        Pair<String, Integer> p = new Pair<>(name, score);
        Pair<Integer, String> q = p.swap();
        System.out.println(p);
        System.out.println(q);
        System.out.println(p.first() + " has " + p.second() + " points");
    }
}
