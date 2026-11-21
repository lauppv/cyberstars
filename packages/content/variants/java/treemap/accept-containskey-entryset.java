import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Vic", "Tommy", "Lance"};
        int[] amounts = {4000, 1000, 500, 3000, 2000};
        Map<String, Integer> totals = new TreeMap<String, Integer>();
        int i = 0;
        while (i < names.length) {
            if (totals.containsKey(names[i])) {
                totals.put(names[i], totals.get(names[i]) + amounts[i]);
            } else {
                totals.put(names[i], amounts[i]);
            }
            i++;
        }
        String first = null, last = null;
        for (Map.Entry<String, Integer> e : totals.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
            if (first == null) first = e.getKey();
            last = e.getKey();
        }
        System.out.println("First: " + first);
        System.out.println("Last: " + last);
    }
}
