class Visitor {
    String name;
    int totalVisits = 0;

    Visitor(String name) {
        this.name = name;
        totalVisits++;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Cortez"};
        Visitor last = null;
        for (String n : names) {
            last = new Visitor(n);
        }
        System.out.println(last.totalVisits);
    }
}
