```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> misiuni = new HashMap<String, Integer>();
        misiuni.put("Tommy", 47);
        misiuni.put("Lance", 12);
        misiuni.put("Phil", 8);
        misiuni.put("Mercedes", 23);

        for (String nume : misiuni.keySet()) {
            if (misiuni.get(nume) > 15) {
                System.out.println(nume + ": " + misiuni.get(nume));
            }
        }
    }
}
```
