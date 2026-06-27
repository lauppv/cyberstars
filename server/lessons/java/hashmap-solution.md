```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> missions = new HashMap<String, Integer>();
        missions.put("Tommy", 47);
        missions.put("Lance", 12);
        missions.put("Phil", 8);
        missions.put("Mercedes", 23);

        for (String name : missions.keySet()) {
            if (missions.get(name) > 15) {
                System.out.println(name + ": " + missions.get(name));
            }
        }
    }
}
```
