abstract class Vehicle {
    private final String label;

    protected Vehicle(String label) {
        this.label = label;
    }

    String label() {
        return label;
    }

    abstract int topSpeed();

    String line() {
        return String.format("%s: %d km/h", label(), topSpeed());
    }
}

class SportsCar extends Vehicle {
    SportsCar(String n) {
        super(n);
    }

    int topSpeed() {
        return 240;
    }
}

class Motorcycle extends Vehicle {
    Motorcycle(String n) {
        super(n);
    }

    int topSpeed() {
        return 200;
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        Vehicle[] garage = {new SportsCar(name1), new Motorcycle(name2)};
        for (Vehicle v : garage) {
            System.out.printf("%s%n", v.line());
        }
    }
}
