```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Stiva {
    private final List<Integer> date = new ArrayList<>();

    void pune(int valoare) {
        date.add(valoare);
    }

    // Folosim Integer (nu int) ca sa putem returna null cand stiva este goala.
    Integer scoate() {
        if (date.size() == 0) {
            return null;
        }
        // LIFO: scoatem elementul din varf (ultima pozitie).
        return date.remove(date.size() - 1);
    }

    Integer varf() {
        if (date.size() == 0) {
            return null;
        }
        return date.get(date.size() - 1);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Stiva stiva = new Stiva();

        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine();

            if (comanda.equals("pune")) {
                int valoare = Integer.parseInt(sc.nextLine());
                stiva.pune(valoare);
            } else if (comanda.equals("scoate")) {
                Integer valoare = stiva.scoate();
                if (valoare == null) {
                    System.out.println("Goala");
                } else {
                    System.out.println(valoare);
                }
            } else {
                Integer valoare = stiva.varf();
                if (valoare == null) {
                    System.out.println("Goala");
                } else {
                    System.out.println(valoare);
                }
            }
        }
    }
}
```
