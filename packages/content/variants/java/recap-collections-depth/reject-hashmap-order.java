import java.util.HashMap;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] arrivals = {"Tommy", "Lance", "Tommy", "Candy", "Lance", "Tommy"};
        HashSet<String> seen = new HashSet<>();
        HashMap<String, Integer> visits = new HashMap<>();
        for (String name : arrivals) {
            System.out.println(seen.add(name) ? "Welcome, " + name : "Back again, " + name);
            visits.put(name, visits.getOrDefault(name, 0) + 1);
        }
        System.out.println("Guest book:");
        String loyal = "";
        int most = 0;
        for (String name : visits.keySet()) {
            System.out.println(name + ": " + visits.get(name));
            if (visits.get(name) > most) { most = visits.get(name); loyal = name; }
        }
        System.out.println("Most loyal: " + loyal);
    }
}
