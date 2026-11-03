import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int width = Integer.parseInt(in.nextLine());
        int height = Integer.parseInt(in.nextLine());
        System.out.println("Area: " + width * height);
        System.out.println("Perimeter: " + 2 * (width + height));
    }
}
