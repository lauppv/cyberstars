```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        int nr1 = 47;
        int nr2 = 12;
        int nr3 = 8;
        int nr4 = 23;

        HashMap<String, Integer> misiuni = new HashMap<String, Integer>();
        misiuni.put("Tommy", nr1);
        misiuni.put("Lance", nr2);
        misiuni.put("Phil", nr3);
        misiuni.put("Mercedes", nr4);

        for (String nume : misiuni.keySet()) {
            if (misiuni.get(nume) > 15) {
                System.out.println(nume + ": " + misiuni.get(nume));
            }
        }
    }
}
```
