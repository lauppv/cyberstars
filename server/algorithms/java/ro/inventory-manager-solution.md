```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Map<String, Integer> inventar = new HashMap<>();

        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine();
            String articol = sc.nextLine();

            if (comanda.equals("adauga")) {
                int cantitate = Integer.parseInt(sc.nextLine());

                // Daca articolul exista deja, crestem cantitatea; altfel, adaugam.
                if (inventar.containsKey(articol)) {
                    inventar.put(articol, inventar.get(articol) + cantitate);
                } else {
                    inventar.put(articol, cantitate);
                }
            } else if (comanda.equals("elimina")) {
                int cantitate = Integer.parseInt(sc.nextLine());

                int curent = 0;
                if (inventar.containsKey(articol)) {
                    curent = inventar.get(articol);
                }

                if (cantitate > curent) {
                    System.out.println("Insuficient " + articol);
                } else {
                    inventar.put(articol, curent - cantitate);
                }
            } else {
                int cantitate = 0;
                if (inventar.containsKey(articol)) {
                    cantitate = inventar.get(articol);
                }
                System.out.println(articol + ": " + cantitate);
            }
        }

        // Numaram articolele cu cantitate strict pozitiva.
        int numar = 0;
        for (int cantitate : inventar.values()) {
            if (cantitate > 0) {
                numar = numar + 1;
            }
        }
        System.out.println("Articole: " + numar);
    }
}
```
