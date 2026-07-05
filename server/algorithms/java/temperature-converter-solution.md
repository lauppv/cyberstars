```java
import java.util.Scanner;

class Temperature {
    private final double value;
    private final char unit;

    Temperature(double value, char unit) {
        this.value = value;
        this.unit = unit;
    }

    double toCelsius() {
        if (unit == 'C') {
            return value;
        }
        return (value - 32) * 5 / 9;
    }

    double toFahrenheit() {
        if (unit == 'F') {
            return value;
        }
        return value * 9 / 5 + 32;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        double value = Double.parseDouble(sc.nextLine());
        // The unit is a 1-character string; grab the first character.
        char unit = sc.nextLine().charAt(0);

        Temperature temp = new Temperature(value, unit);

        System.out.printf("Celsius: %.1f%n", temp.toCelsius());
        System.out.printf("Fahrenheit: %.1f%n", temp.toFahrenheit());
    }
}
```
