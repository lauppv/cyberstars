```java
import java.util.Scanner;

class Dreptunghi {
    private final int latime;
    private final int inaltime;

    Dreptunghi(int latime, int inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    int getArie() {
        return latime * inaltime;
    }

    int getPerimetru() {
        return 2 * (latime + inaltime);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int latime = Integer.parseInt(sc.nextLine());
        int inaltime = Integer.parseInt(sc.nextLine());

        Dreptunghi dreptunghi = new Dreptunghi(latime, inaltime);

        System.out.println("Arie: " + dreptunghi.getArie());
        System.out.println("Perimetru: " + dreptunghi.getPerimetru());
    }
}
```
