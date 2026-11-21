import java.util.HashSet;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] arrivals = {"Tommy", "Lance", "Tommy", "Candy", "Lance", "Tommy"};
        HashSet<String> seen = new HashSet<>();
        for (String a : arrivals) {
            if (seen.contains(a)) System.out.println("Back again, " + a);
            else { System.out.println("Welcome, " + a); seen.add(a); }
        }
        TreeMap<String, Integer> visits = new TreeMap<>();
        for (String a : arrivals) {
            if (!visits.containsKey(a)) visits.put(a, 0);
            visits.put(a, visits.get(a) + 1);
        }
        System.out.println("Guest book:");
        int max = 0;
        for (int v : visits.values()) max = Math.max(max, v);
        String loyal = null;
        for (String k : visits.keySet()) {
            System.out.println(k + ": " + visits.get(k));
            if (loyal == null && visits.get(k) == max) loyal = k;
        }
        System.out.println("Most loyal: " + loyal);
    }
}
