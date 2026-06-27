```java
public class Main {
    public static String[] filter(String[] signals) {
        int valid = 0;
        for (int i = 0; i < signals.length; i++) {
            if (signals[i].equals("out")) {
                break;
            }
            if (signals[i].equals("static")) {
                continue;
            }
            valid++;
        }

        String[] result = new String[valid];
        int position = 0;
        for (int i = 0; i < signals.length; i++) {
            if (signals[i].equals("out")) {
                break;
            }
            if (signals[i].equals("static")) {
                continue;
            }
            result[position] = signals[i].toUpperCase();
            position++;
        }
        return result;
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance", "static", "cortez", "static", "diaz", "out", "mercedes" };

        String[] cleaned = filter(signals);
        for (String s : cleaned) {
            System.out.println(s);
        }
        System.out.println("Total: " + cleaned.length);
    }
}
```
