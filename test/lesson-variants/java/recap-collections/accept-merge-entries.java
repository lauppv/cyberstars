import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] purchases = {"Pistol", "Shotgun", "Pistol", "Automatic", "Shotgun", "Pistol", "Automatic"};

        Map<String, Integer> tally = new HashMap<>();
        for (String p : purchases) {
            tally.merge(p, 1, Integer::sum);
        }
        Map.Entry<String, Integer> top = null;
        List<String> repeated = new ArrayList<>();
        for (Map.Entry<String, Integer> e : tally.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
            if (top == null || e.getValue() > top.getValue()) top = e;
            if (e.getValue() >= 2) repeated.add(e.getKey());
        }
        System.out.println("Most bought: " + top.getKey());
        Collections.sort(repeated);
        System.out.println("Popular (sorted): " + repeated);
    }
}
