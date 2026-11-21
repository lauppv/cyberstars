```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] days = {"Monday", "Tuesday", "Wednesday"};
        int[] earnings = {1200, 800, 2500};

        int total = 0;
        try (PrintWriter out = new PrintWriter(new FileWriter("ledger.txt"))) {
            for (int i = 0; i < days.length; i++) {
                out.println(days[i] + ": " + earnings[i]);
                total += earnings[i];
            }
        }

        try (PrintWriter out = new PrintWriter(new FileWriter("ledger.txt", true))) {
            out.println("Total: " + total);
        }

        System.out.print(Files.readString(Path.of("ledger.txt")));
    }
}
```
