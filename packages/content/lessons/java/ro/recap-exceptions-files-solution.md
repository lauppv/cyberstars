```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

class SumaNegativaException extends Exception {
    SumaNegativaException() {
        super("suma negativa");
    }
}

public class Main {
    static int verificaSuma(int suma) throws SumaNegativaException {
        if (suma < 0) {
            throw new SumaNegativaException();
        }
        return suma;
    }

    public static void main(String[] args) throws IOException {
        String[] intrari = {"Phil,500", "Kent,multi", "Lance,-200", "Mercedes,1500"};

        try (PrintWriter out = new PrintWriter(new FileWriter("urma.txt"))) {
            for (String intrare : intrari) {
                out.println(intrare);
            }
        }

        int total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("urma.txt"))) {
            String rand;
            while ((rand = in.readLine()) != null) {
                String[] parti = rand.split(",");
                try {
                    int suma = verificaSuma(Integer.parseInt(parti[1]));
                    System.out.println(parti[0] + " a platit " + suma);
                    total += suma;
                } catch (NumberFormatException e) {
                    System.out.println("Suma gresita: " + rand);
                } catch (SumaNegativaException e) {
                    System.out.println("Respins: " + rand + " (" + e.getMessage() + ")");
                }
            }
        }
        System.out.println("Total: " + total);
    }
}
```
