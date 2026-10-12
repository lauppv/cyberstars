```java
import java.util.Scanner;

class ContBancar {
    private int sold;

    ContBancar(int sold) {
        this.sold = sold;
    }

    void depune(int suma) {
        sold = sold + suma;
    }

    boolean retrage(int suma) {
        if (suma > sold) {
            return false;
        }
        sold = sold - suma;
        return true;
    }

    int getSold() {
        return sold;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int sold = Integer.parseInt(sc.nextLine());
        int n = Integer.parseInt(sc.nextLine());

        ContBancar cont = new ContBancar(sold);

        for (int i = 0; i < n; i++) {
            String operatie = sc.nextLine();
            int suma = Integer.parseInt(sc.nextLine());

            if (operatie.equals("depune")) {
                cont.depune(suma);
            } else {
                if (!cont.retrage(suma)) {
                    System.out.println("Fonduri insuficiente");
                }
            }
        }

        System.out.println("Sold: " + cont.getSold());
    }
}
```
