interface Shape {
    double area();
    String describe();
}

// implement Circle, Rectangle, Triangle

public class Main {
    static void printShape(Shape s) {
        System.out.println(String.format("%s — Area: %.2f", s.describe(), s.area()));
    }

    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle(5),
            new Rectangle(4, 6),
            new Triangle(3, 8)
        };

        for (Shape s : shapes) {
            printShape(s);
        }

        // try casting shapes[0] to Circle, print radius
        // try casting shapes[1] to Circle, catch the exception
    }
}
