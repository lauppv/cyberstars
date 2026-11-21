import java.io.*;
import java.nio.file.*;

public class Main {
    static class NegativeAmountException extends Exception {
        NegativeAmountException(String msg) { super(msg); }
    }

    static void check(int a) throws NegativeAmountException {
        if (a < 0) throw new NegativeAmountException("negative amount");
    }

    public static void main(String[] args) {
        String[] entries = {"Phil,500", "Kent,lots", "Lance,-200", "Mercedes,1500"};
        int total = 0;
        try {
            try (FileWriter w = new FileWriter("trail.txt")) {
                for (String e : entries) w.write(e + System.lineSeparator());
            }
            for (String line : Files.readAllLines(Path.of("trail.txt"))) {
                int comma = line.indexOf(',');
                String who = line.substring(0, comma);
                String amt = line.substring(comma + 1);
                try {
                    int a = Integer.parseInt(amt);
                    check(a);
                    total += a;
                    System.out.println(who + " paid " + a);
                } catch (NegativeAmountException ex) {
                    System.out.println("Rejected: " + line + " (" + ex.getMessage() + ")");
                } catch (NumberFormatException ex) {
                    System.out.println("Bad amount: " + line);
                }
            }
        } catch (IOException e) {
            System.out.println("File trouble");
        }
        System.out.println("Total: " + total);
    }
}
