import java.util.*;

abstract class Shape {
    abstract double getArea();
}

class Circle extends Shape {
    private final double r;

    Circle(double r) {
        this.r = r;
    }

    double getArea() {
        return Math.PI * r * r;
    }
}

class Rectangle extends Shape {
    private final double w;
    private final double h;

    Rectangle(double w, double h) {
        this.w = w;
        this.h = h;
    }

    double getArea() {
        return w * h;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        List<Shape> shapes = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (in.nextLine().equals("circle")) {
                shapes.add(new Circle(Double.parseDouble(in.nextLine())));
            } else {
                double w = Double.parseDouble(in.nextLine());
                shapes.add(new Rectangle(w, Double.parseDouble(in.nextLine())));
            }
        }
        double total = 0;
        for (Shape s : shapes) total += s.getArea();
        System.out.printf("Total: %.2f%n", total);
    }
}
