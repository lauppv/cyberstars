```java
import java.util.ArrayList;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};

        ArrayList<String> phone = new ArrayList<>();
        for (String c : contacts) {
            phone.add(c);
        }

        for (String search : searches) {
            Optional<String> found = phone.stream()
                .filter(c -> c.startsWith(search))
                .findFirst();
            System.out.println(search + ": " + found.orElse("no one"));
        }
    }
}
```
