```java
import java.util.Scanner;

class ContBancar {
    private int sold;

    ContBancar(int sold) {
        this.sold = sold;
    }

    void depune(int suma) {
        sold += suma;
    }

    boolean retrage(int suma) {
        if (suma > sold) {
            return false;
        }
        sold -= suma;
        return true;
    }

    int getSold() {
        return sold;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sold = Integer.parseInt(sc.nextLine().trim());
        int n = Integer.parseInt(sc.nextLine().trim());
        ContBancar cont = new ContBancar(sold);
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            int suma = Integer.parseInt(parti[1]);
            if (parti[0].equals("deposit")) {
                cont.depune(suma);
            } else {
                if (!cont.retrage(suma)) {
                    System.out.println("Insufficient funds");
                }
            }
        }
        System.out.println("Balance: " + cont.getSold());
    }
}
```
