import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

class NegativeAmountException extends Exception {
    NegativeAmountException() { super("negative amount"); }
}

public class Main {
    public static void main(String[] args) throws IOException {
        String[] entries = {"Phil,500", "Kent,lots", "Lance,-200", "Mercedes,1500"};
        try (PrintWriter out = new PrintWriter(new FileWriter("trail.txt"))) {
            for (String e : entries) out.println(e);
        }
        int total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("trail.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] p = line.split(",");
                int a = 0;
                try {
                    a = Integer.parseInt(p[1]);
                    total += a;
                    if (a < 0) throw new NegativeAmountException();
                    System.out.println(p[0] + " paid " + a);
                } catch (NumberFormatException e) {
                    System.out.println("Bad amount: " + line);
                } catch (NegativeAmountException e) {
                    System.out.println("Rejected: " + line + " (" + e.getMessage() + ")");
                }
            }
        }
        System.out.println("Total: " + total);
    }
}
