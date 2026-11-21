```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] nume = {"lance", "Phil", "kent", "CORTEZ"};

        ArrayList<String> apeluri = new ArrayList<>();
        for (String n : nume) {
            apeluri.add(n);
        }

        apeluri.replaceAll(String::toUpperCase);
        apeluri.sort(String::compareTo);
        apeluri.forEach(System.out::println);
        System.out.println("Apeluri de facut: " + apeluri.size());
    }
}
```
