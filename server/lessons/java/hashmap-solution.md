```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        int count1 = 47;
        int count2 = 12;
        int count3 = 8;
        int count4 = 23;

        HashMap<String, Integer> missions = new HashMap<String, Integer>();
        missions.put("Tommy", count1);
        missions.put("Lance", count2);
        missions.put("Phil", count3);
        missions.put("Mercedes", count4);

        for (String name : missions.keySet()) {
            if (missions.get(name) > 15) {
                System.out.println(name + ": " + missions.get(name));
            }
        }
    }
}
```
