import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] entries = {"Tommy", "Lance", "Tommy", "Mercedes", "Lance", "Phil"};
        ArrayList<String> inside = new ArrayList<>();
        for (String name : entries) {
            if (inside.contains(name)) {
                System.out.println("Already inside: " + name);
            } else {
                inside.add(name);
                System.out.println("New guest: " + name);
            }
        }
        System.out.println("Unique guests: " + inside.size());
    }
}
