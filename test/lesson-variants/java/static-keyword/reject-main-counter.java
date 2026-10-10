class Visitor {
    String name;

    Visitor(String name) {
        this.name = name;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        int totalVisits = 0;
        for (String n : names) {
            new Visitor(n);
            totalVisits++;
        }
        System.out.println(totalVisits);
    }
}
