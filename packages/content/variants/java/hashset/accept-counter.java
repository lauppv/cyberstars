import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] entries = {"Tommy", "Lance", "Tommy", "Mercedes", "Lance", "Phil"};
        HashSet<String> seen = new HashSet<>();
        int unique = 0;
        for (int i = 0; i < entries.length; i++) {
            boolean isNew = seen.add(entries[i]);
            if (isNew) unique++;
            System.out.println((isNew ? "New guest: " : "Already inside: ") + entries[i]);
        }
        System.out.println("Unique guests: " + unique);
    }
}
