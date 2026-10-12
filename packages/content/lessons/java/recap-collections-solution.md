```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        String[] purchases = {"Pistol", "Shotgun", "Pistol", "Automatic", "Shotgun", "Pistol", "Automatic"};

        HashMap<String, Integer> count = new HashMap<>();
        for (String weapon : purchases) {
            if (count.containsKey(weapon)) {
                count.put(weapon, count.get(weapon) + 1);
            } else {
                count.put(weapon, 1);
            }
        }

        for (String weapon : count.keySet()) {
            System.out.println(weapon + ": " + count.get(weapon));
        }

        String best = "";
        int maxCount = 0;
        for (String weapon : count.keySet()) {
            if (count.get(weapon) > maxCount) {
                maxCount = count.get(weapon);
                best = weapon;
            }
        }
        System.out.println("Most bought: " + best);

        ArrayList<String> popular = new ArrayList<>();
        for (String weapon : count.keySet()) {
            if (count.get(weapon) > 1) {
                popular.add(weapon);
            }
        }
        Collections.sort(popular);
        System.out.println("Popular (sorted): " + popular);
    }
}
```
