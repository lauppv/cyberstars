import java.util.HashSet;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] arrivals = {"Tommy", "Lance", "Tommy", "Candy", "Lance", "Tommy"};
        HashSet<String> seen = new HashSet<>();
        TreeMap<String, Integer> visits = new TreeMap<>();
        for (String name : arrivals) {
            if (seen.add(name)) {
                System.out.println("Welcome, " + name);
                visits.put(name, 1);
            } else {
                System.out.println("Back again, " + name);
            }
        }
        System.out.println("Guest book:");
        for (String name : visits.keySet()) System.out.println(name + ": " + visits.get(name));
        System.out.println("Most loyal: " + visits.firstKey());
    }
}
