```java
import java.util.ArrayList;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        String[] contacte = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] cautari = {"Ken", "Lan", "Son", "Ken R"};

        ArrayList<String> telefon = new ArrayList<>();
        for (String c : contacte) {
            telefon.add(c);
        }

        for (String cautare : cautari) {
            Optional<String> gasit = telefon.stream()
                .filter(c -> c.startsWith(cautare))
                .findFirst();
            System.out.println(cautare + ": " + gasit.orElse("nimeni"));
        }
    }
}
```
