class Visitor {
    String name;
    Visitor(String name) { this.name = name; }
}

public class Main {
    static final int START = 0;
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Cortez"};
        int count = START;
        for (String n : names) { new Visitor(n); count++; }
        System.out.println(count);
    }
}
