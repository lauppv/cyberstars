import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] entries = {"Tommy", "Lance", "Tommy", "Mercedes", "Lance", "Phil"};
        HashSet<String> inside = new HashSet<>();
        for (String name : entries) {
            if (inside.add(name.toLowerCase())) {
                System.out.println("New guest: " + name);
            } else {
                System.out.println("Already inside: " + name);
            }
        }
        System.out.println("Unique guests: " + inside.size());
    }
}
