import java.util.ArrayList;
import java.util.HashMap;

public class Main {
    static String mostBought(HashMap<String, Integer> m) {
        String best = null;
        for (String k : m.keySet()) {
            if (best == null || m.get(k) > m.get(best)) best = k;
        }
        return best;
    }

    public static void main(String[] args) {
        String[] purchases = {"Pistol", "Shotgun", "Pistol", "Automatic", "Shotgun", "Pistol", "Automatic"};

        HashMap<String, Integer> c = new HashMap<String, Integer>();
        int i = 0;
        while (i < purchases.length) {
            c.put(purchases[i], c.getOrDefault(purchases[i], 0) + 1);
            i++;
        }
        ArrayList<String> twice = new ArrayList<String>();
        for (String k : c.keySet()) {
            System.out.println(k + ": " + c.get(k));
            if (c.get(k) > 1) twice.add(k);
        }
        System.out.println("Most bought: " + mostBought(c));
        twice.sort(null);
        System.out.println("Popular (sorted): " + twice);
    }
}
