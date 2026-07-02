```java
import java.util.Scanner;

class Rectangle {
    private final int latime;
    private final int inaltime;

    Rectangle(int latime, int inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    int getArea() {
        return latime * inaltime;
    }

    int getPerimeter() {
        return 2 * (latime + inaltime);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parti = sc.nextLine().trim().split("\\s+");
        int latime = Integer.parseInt(parti[0]);
        int inaltime = Integer.parseInt(parti[1]);
        Rectangle dreptunghi = new Rectangle(latime, inaltime);
        System.out.println("Area: " + dreptunghi.getArea());
        System.out.println("Perimeter: " + dreptunghi.getPerimeter());
    }
}
```
