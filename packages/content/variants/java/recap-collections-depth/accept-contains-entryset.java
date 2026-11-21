import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] arrivals = {"Tommy", "Lance", "Tommy", "Candy", "Lance", "Tommy"};
        Set<String> inside = new HashSet<String>();
        Map<String, Integer> book = new TreeMap<String, Integer>();
        for (int i = 0; i < arrivals.length; i++) {
            String n = arrivals[i];
            System.out.println(inside.contains(n) ? "Back again, " + n : "Welcome, " + n);
            inside.add(n);
            book.merge(n, 1, Integer::sum);
        }
        System.out.println("Guest book:");
        Map.Entry<String, Integer> best = null;
        for (Map.Entry<String, Integer> e : book.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
            if (best == null || e.getValue() > best.getValue()) best = e;
        }
        System.out.println("Most loyal: " + best.getKey());
    }
}
