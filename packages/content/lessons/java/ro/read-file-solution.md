```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] randuri = {"Tommy,47", "Lance,12", "Mercedes,23"};

        try (PrintWriter out = new PrintWriter(new FileWriter("echipa.txt"))) {
            for (String rand : randuri) {
                out.println(rand);
            }
        }

        int total = 0;
        int maxim = -1;
        String celMaiBun = "";
        try (BufferedReader in = new BufferedReader(new FileReader("echipa.txt"))) {
            String rand;
            while ((rand = in.readLine()) != null) {
                String[] parti = rand.split(",");
                int misiuni = Integer.parseInt(parti[1]);
                System.out.println(parti[0] + ": " + misiuni + " misiuni");
                total += misiuni;
                if (misiuni > maxim) {
                    maxim = misiuni;
                    celMaiBun = parti[0];
                }
            }
        }
        System.out.println("Total: " + total);
        System.out.println("Cele mai multe: " + celMaiBun);
    }
}
```
