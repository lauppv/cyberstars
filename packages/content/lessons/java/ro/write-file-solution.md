```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] zile = {"Luni", "Marti", "Miercuri"};
        int[] castiguri = {1200, 800, 2500};

        int total = 0;
        try (PrintWriter out = new PrintWriter(new FileWriter("registru.txt"))) {
            for (int i = 0; i < zile.length; i++) {
                out.println(zile[i] + ": " + castiguri[i]);
                total += castiguri[i];
            }
        }

        try (PrintWriter out = new PrintWriter(new FileWriter("registru.txt", true))) {
            out.println("Total: " + total);
        }

        System.out.print(Files.readString(Path.of("registru.txt")));
    }
}
```
