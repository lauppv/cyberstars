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
    private final double width;
    private final double height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double getArea() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        double total = 0;

        for (int i = 0; i < n; i++) {
            String type = sc.nextLine();

            Shape shape;
            if (type.equals("circle")) {
                double radius = Double.parseDouble(sc.nextLine());
                shape = new Circle(radius);
            } else {
                double width = Double.parseDouble(sc.nextLine());
                double height = Double.parseDouble(sc.nextLine());
                shape = new Rectangle(width, height);
            }

            total = total + shape.getArea();
        }

        System.out.printf("Total: %.2f%n", total);
    }
}
```
