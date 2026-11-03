import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double value = Double.parseDouble(in.nextLine());
        boolean f = in.nextLine().equals("F");
        double c = f ? (value - 32) * 5 / 9 : value;
        System.out.printf("Celsius: %.1f%n", c);
        System.out.printf("Fahrenheit: %.1f%n", f ? value : value * 9 / 5 + 32);
    }
}
