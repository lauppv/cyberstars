import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] lines = {"Tommy,47", "Lance,12", "Mercedes,23"};
        try (PrintWriter out = new PrintWriter(new FileWriter("crew.txt"))) {
            for (String line : lines) out.println(line);
        }
        int total = 0, most = -1;
        String best = "";
        for (String line : Files.readAllLines(Path.of("crew.txt"))) {
            String[] parts = line.split(",");
            int m = Integer.parseInt(parts[1]);
            System.out.println(parts[0] + ": " + m + " missions");
            total += m;
            if (m > most) { most = m; best = parts[0]; }
        }
        System.out.println("Total: " + total);
        System.out.println("Most: " + best);
    }
}
