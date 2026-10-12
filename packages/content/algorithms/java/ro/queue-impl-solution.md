```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Coada {
    private final List<Integer> date = new ArrayList<>();

    void adauga(int valoare) {
        date.add(valoare);
    }

    // Folosim Integer (nu int) ca sa putem returna null cand coada este goala.
    Integer scoate() {
        if (date.size() == 0) {
            return null;
        }
        // FIFO: scoatem elementul din fata (pozitia 0).
        return date.remove(0);
    }

    Integer varf() {
        if (date.size() == 0) {
            return null;
        }
        return date.get(0);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Coada coada = new Coada();

        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine();

            if (comanda.equals("adauga")) {
                int valoare = Integer.parseInt(sc.nextLine());
                coada.adauga(valoare);
            } else if (comanda.equals("scoate")) {
                Integer valoare = coada.scoate();
                if (valoare == null) {
                    System.out.println("Goala");
                } else {
                    System.out.println(valoare);
                }
            } else {
                Integer valoare = coada.varf();
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
