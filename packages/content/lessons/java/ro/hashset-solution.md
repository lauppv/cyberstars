```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] intrari = {"Tommy", "Lance", "Tommy", "Mercedes", "Lance", "Phil"};

        HashSet<String> inauntru = new HashSet<>();
        for (String nume : intrari) {
            if (inauntru.add(nume)) {
                System.out.println("Invitat nou: " + nume);
            } else {
                System.out.println("Deja înăuntru: " + nume);
            }
        }
        System.out.println("Invitați diferiți: " + inauntru.size());
    }
}
```
