```java
import java.util.Scanner;

class Articol {
    private final String nume;
    private final double pret;
    private final int cantitate;

    Articol(String nume, double pret, int cantitate) {
        this.nume = nume;
        this.pret = pret;
        this.cantitate = cantitate;
    }

    double getTotal() {
        return pret * cantitate;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        double totalGeneral = 0;

        for (int i = 0; i < n; i++) {
            String nume = sc.nextLine();
            double pret = Double.parseDouble(sc.nextLine());
            int cantitate = Integer.parseInt(sc.nextLine());

            Articol articol = new Articol(nume, pret, cantitate);
            totalGeneral = totalGeneral + articol.getTotal();
        }

        System.out.printf("Total: %.2f%n", totalGeneral);
    }
}
```
