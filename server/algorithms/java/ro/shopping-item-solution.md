```java
import java.util.Scanner;

class ShoppingItem {
    private final String nume;
    private final double pret;
    private final int cantitate;

    ShoppingItem(String nume, double pret, int cantitate) {
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
        int n = Integer.parseInt(sc.nextLine().trim());
        double totalGeneral = 0;
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            String nume = parti[0];
            double pret = Double.parseDouble(parti[1]);
            int cantitate = Integer.parseInt(parti[2]);
            ShoppingItem articol = new ShoppingItem(nume, pret, cantitate);
            totalGeneral += articol.getTotal();
        }
        System.out.printf("Total: %.2f%n", totalGeneral);
    }
}
```
