```java
public class Main {
    static String apel(String sef, String... membri) {
        if (membri.length == 0) {
            return sef + " lucreaza singur";
        }
        StringBuilder nume = new StringBuilder();
        for (int i = 0; i < membri.length; i++) {
            if (i > 0) {
                nume.append(", ");
            }
            nume.append(membri[i]);
        }
        return sef + " conduce " + membri.length + ": " + nume;
    }

    public static void main(String[] args) {
        String sef = "Tommy";
        String[] banda = { "Lance", "Ken" };

        System.out.println(apel(sef, banda));
        System.out.println(apel(sef));
    }
}
```
