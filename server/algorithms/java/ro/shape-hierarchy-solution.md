```java
import java.util.Scanner;

abstract class Shape {
    abstract double getArea();
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double getArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    private final double latime;
    private final double inaltime;

    Rectangle(double latime, double inaltime) {
        this.latime = latime;
        this.inaltime = inaltime;
    }

    @Override
    double getArea() {
        return latime * inaltime;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        double total = 0;
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            Shape forma;
            if (parti[0].equals("circle")) {
                forma = new Circle(Double.parseDouble(parti[1]));
            } else {
                forma = new Rectangle(Double.parseDouble(parti[1]), Double.parseDouble(parti[2]));
            }
            total += forma.getArea();
        }
        System.out.printf("Total: %.2f%n", total);
    }
}
```
