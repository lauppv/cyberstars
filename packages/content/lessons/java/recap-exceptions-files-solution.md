```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

class NegativeAmountException extends Exception {
    NegativeAmountException() {
        super("negative amount");
    }
}

public class Main {
    static int checkAmount(int amount) throws NegativeAmountException {
        if (amount < 0) {
            throw new NegativeAmountException();
        }
        return amount;
    }

    public static void main(String[] args) throws IOException {
        String[] entries = {"Phil,500", "Kent,lots", "Lance,-200", "Mercedes,1500"};

        try (PrintWriter out = new PrintWriter(new FileWriter("trail.txt"))) {
            for (String entry : entries) {
                out.println(entry);
            }
        }

        int total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("trail.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] parts = line.split(",");
                try {
                    int amount = checkAmount(Integer.parseInt(parts[1]));
                    System.out.println(parts[0] + " paid " + amount);
                    total += amount;
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
```
