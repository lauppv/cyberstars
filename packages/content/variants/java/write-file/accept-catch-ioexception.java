import java.io.*;
import java.nio.file.*;

public class Main {
    public static void main(String[] args) {
        String[] days = {"Monday", "Tuesday", "Wednesday"};
        int[] earnings = {1200, 800, 2500};
        try {
            try (PrintWriter pw = new PrintWriter(new FileWriter("ledger.txt", false))) {
                for (int i = 0; i < days.length; i++) pw.printf("%s: %d%n", days[i], earnings[i]);
            }
            int sum = 0;
            for (int e : earnings) sum += e;
            try (FileWriter fw = new FileWriter("ledger.txt", true)) {
                fw.write("Total: " + sum + "\n");
            }
            System.out.print(Files.readString(Path.of("ledger.txt")));
        } catch (IOException e) {
            System.out.println("Could not write the ledger");
        }
    }
}
