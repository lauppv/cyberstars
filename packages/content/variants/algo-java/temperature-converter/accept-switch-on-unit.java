import java.util.*;

class Temperature {
    private final double celsius;

    Temperature(double value, String unit) {
        celsius = switch (unit) {
            case "F" -> (value - 32) * 5 / 9;
            default -> value;
        };
    }

    double celsius() {
        return celsius;
    }

    double fahrenheit() {
        return celsius * 9 / 5 + 32;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double value = Double.parseDouble(in.nextLine().trim());
        Temperature t = new Temperature(value, in.nextLine().trim());
        System.out.printf("Celsius: %.1f%nFahrenheit: %.1f%n", t.celsius(), t.fahrenheit());
    }
}
