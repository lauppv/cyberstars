```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Map<String, Integer> inventar = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            String comanda = parti[0];
            String articol = parti[1];
            if (comanda.equals("add")) {
                int cantitate = Integer.parseInt(parti[2]);
                inventar.merge(articol, cantitate, Integer::sum);
            } else if (comanda.equals("remove")) {
                int cantitate = Integer.parseInt(parti[2]);
                int curent = inventar.getOrDefault(articol, 0);
                if (cantitate > curent) {
                    System.out.println("Insuficient " + articol);
                } else {
                    inventar.put(articol, curent - cantitate);
                }
            } else if (comanda.equals("check")) {
                int cantitate = inventar.getOrDefault(articol, 0);
                System.out.println(articol + ": " + cantitate);
            }
        }
        int numar = 0;
        for (int cantitate : inventar.values()) {
            if (cantitate > 0) {
                numar++;
            }
        }
        System.out.println("Articole: " + numar);
    }
}
```
