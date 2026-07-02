```java
import java.util.Scanner;

class Rectangle {
    private final int width;
    private final int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int getArea() {
        return width * height;
    }

    int getPerimeter() {
        return 2 * (width + height);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\s+");
        int width = Integer.parseInt(parts[0]);
        int height = Integer.parseInt(parts[1]);
        Rectangle rect = new Rectangle(width, height);
        System.out.println("Area: " + rect.getArea());
        System.out.println("Perimeter: " + rect.getPerimeter());
    }
}
```
