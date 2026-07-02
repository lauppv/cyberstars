```java
import java.util.Scanner;

class Temperature {
    private final double valoare;
    private final char unitate;

    Temperature(double valoare, char unitate) {
        this.valoare = valoare;
        this.unitate = unitate;
    }

    double toCelsius() {
        if (unitate == 'C') {
            return valoare;
        }
        return (valoare - 32) * 5 / 9;
    }

    double toFahrenheit() {
        if (unitate == 'F') {
            return valoare;
        }
        return valoare * 9 / 5 + 32;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parti = sc.nextLine().trim().split("\\s+");
        double valoare = Double.parseDouble(parti[0]);
        char unitate = parti[1].charAt(0);
        Temperature temp = new Temperature(valoare, unitate);
        System.out.printf("Celsius: %.1f%n", temp.toCelsius());
        System.out.printf("Fahrenheit: %.1f%n", temp.toFahrenheit());
    }
}
```
