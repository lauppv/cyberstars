import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] entries = {"Tommy", "Lance", "Tommy", "Mercedes", "Lance", "Phil"};
        Set<String> door = new HashSet<String>();
        int i = 0;
        while (i < entries.length) {
            String who = entries[i];
            if (door.contains(who)) {
                System.out.println("Already inside: " + who);
            } else {
                door.add(who);
                System.out.println("New guest: " + who);
            }
            i++;
        }
        System.out.println("Unique guests: " + door.size());
    }
}
