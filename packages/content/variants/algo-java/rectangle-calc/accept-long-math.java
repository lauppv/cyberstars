import java.util.*;

class Rectangle {
    final long width;
    final long height;

    Rectangle(long width, long height) {
        this.width = width;
        this.height = height;
    }

    long getArea() {
        return width * height;
    }

    long getPerimeter() {
        return width + width + height + height;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        Rectangle r = new Rectangle(in.nextLong(), in.nextLong());
        System.out.printf("Area: %d%nPerimeter: %d%n", r.getArea(), r.getPerimeter());
    }
}
