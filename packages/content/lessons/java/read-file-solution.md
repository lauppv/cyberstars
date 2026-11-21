```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] lines = {"Tommy,47", "Lance,12", "Mercedes,23"};

        try (PrintWriter out = new PrintWriter(new FileWriter("crew.txt"))) {
            for (String line : lines) {
                out.println(line);
            }
        }

        int total = 0;
        int most = -1;
        String best = "";
        try (BufferedReader in = new BufferedReader(new FileReader("crew.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] parts = line.split(",");
                int missions = Integer.parseInt(parts[1]);
                System.out.println(parts[0] + ": " + missions + " missions");
                total += missions;
                if (missions > most) {
                    most = missions;
                    best = parts[0];
                }
            }
        }
        System.out.println("Total: " + total);
        System.out.println("Most: " + best);
    }
}
```
