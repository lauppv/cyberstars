```java
import java.util.Scanner;

abstract class Forma {
    abstract double getArie();
}

class Cerc extends Forma {
    private final double raza;

    Cerc(double raza) {
        this.raza = raza;
    }

    @Override
    double getArie() {
        return Math.PI * raza * raza;
    }
}

class Dreptunghi extends Forma {
    private final double latime;
    private final double inaltime;

    Dreptunghi(double latime, double inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    @Override
    double getArie() {
        return latime * inaltime;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        double total = 0;

        for (int i = 0; i < n; i++) {
            String tip = sc.nextLine();

            Forma forma;
            if (tip.equals("cerc")) {
                double raza = Double.parseDouble(sc.nextLine());
                forma = new Cerc(raza);
            } else {
                double latime = Double.parseDouble(sc.nextLine());
                double inaltime = Double.parseDouble(sc.nextLine());
                forma = new Dreptunghi(latime, inaltime);
            }

            total = total + forma.getArie();
        }

        System.out.printf("Total: %.2f%n", total);
    }
}
```
