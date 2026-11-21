```java
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
            } else {
                System.out.println("Back again, " + name);
            }
            visits.put(name, visits.getOrDefault(name, 0) + 1);
        }

        System.out.println("Guest book:");
        String loyal = "";
        int most = 0;
        for (String name : visits.keySet()) {
            int count = visits.get(name);
            System.out.println(name + ": " + count);
            if (count > most) {
                most = count;
                loyal = name;
            }
        }
        System.out.println("Most loyal: " + loyal);
    }
}
```
