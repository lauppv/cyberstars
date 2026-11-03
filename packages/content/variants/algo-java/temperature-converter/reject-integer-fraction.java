import java.util.*;

class Temperature {
    private final double value;
    private final char unit;

    Temperature(double value, char unit) {
        this.value = value;
        this.unit = unit;
    }

    double toCelsius() {
        return unit == 'C' ? value : (value - 32) * (5 / 9);
    }

    double toFahrenheit() {
        return unit == 'F' ? value : value * (9 / 5) + 32;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double value = Double.parseDouble(in.nextLine());
        Temperature t = new Temperature(value, in.nextLine().charAt(0));
        System.out.printf("Celsius: %.1f%n", t.toCelsius());
        System.out.printf("Fahrenheit: %.1f%n", t.toFahrenheit());
    }
}
