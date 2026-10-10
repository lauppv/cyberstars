import java.util.ArrayList;
import java.util.HashMap;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        String[] purchases = {"Pistol", "Shotgun", "Pistol", "Automatic", "Shotgun", "Pistol", "Automatic"};

        HashMap<String, Integer> count = new HashMap<>();
        ArrayList<String> popular = new ArrayList<>();
        for (String weapon : purchases) {
            count.put(weapon, count.getOrDefault(weapon, 0) + 1);
            if (count.get(weapon) == 2) popular.add(weapon);
        }
        for (String weapon : count.keySet()) {
            System.out.println(weapon + ": " + count.get(weapon));
        }
        String best = "";
        for (String weapon : count.keySet()) {
            if (best.isEmpty() || count.get(weapon) > count.get(best)) best = weapon;
        }
        System.out.println("Most bought: " + best);
        Collections.sort(new ArrayList<String>());
        System.out.println("Popular (sorted): " + popular);
    }
}
