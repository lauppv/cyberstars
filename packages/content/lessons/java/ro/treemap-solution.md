```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] nume = {"Tommy", "Lance", "Vic", "Tommy", "Lance"};
        int[] sume = {4000, 1000, 500, 3000, 2000};

        TreeMap<String, Integer> caiet = new TreeMap<>();
        for (int i = 0; i < nume.length; i++) {
            caiet.put(nume[i], caiet.getOrDefault(nume[i], 0) + sume[i]);
        }

        for (String persoana : caiet.keySet()) {
            System.out.println(persoana + ": " + caiet.get(persoana));
        }
        System.out.println("Primul: " + caiet.firstKey());
        System.out.println("Ultimul: " + caiet.lastKey());
    }
}
```
