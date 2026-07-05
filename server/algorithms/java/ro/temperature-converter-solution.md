```java
import java.util.Scanner;

class Temperatura {
    private final double valoare;
    private final char unitate;

    Temperatura(double valoare, char unitate) {
        this.valoare = valoare;
        this.unitate = unitate;
    }

    double laCelsius() {
        if (unitate == 'C') {
            return valoare;
        }
        return (valoare - 32) * 5 / 9;
    }

    double laFahrenheit() {
        if (unitate == 'F') {
            return valoare;
        }
        return valoare * 9 / 5 + 32;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        double valoare = Double.parseDouble(sc.nextLine());
        // Unitatea vine ca sir de 1 caracter; luam primul caracter.
        char unitate = sc.nextLine().charAt(0);

        Temperatura temp = new Temperatura(valoare, unitate);

        System.out.printf("Celsius: %.1f%n", temp.laCelsius());
        System.out.printf("Fahrenheit: %.1f%n", temp.laFahrenheit());
    }
}
```
