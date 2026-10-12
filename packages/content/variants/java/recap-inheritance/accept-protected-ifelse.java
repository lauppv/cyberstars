abstract class Vehicle {
    protected final String name;
    protected int fuel;

    protected Vehicle(String name) {
        this.name = name;
        this.fuel = 100;
    }

    abstract String type();

    abstract int fuelPerKm();

    void drive(int km) {
        int left = fuel - km * fuelPerKm();
        if (left < 0) {
            System.out.println("Not enough fuel!");
        } else {
            fuel = left;
        }
    }

    @Override
    public String toString() {
        return String.format("%s (%s) - Fuel: %d%%", name, type(), fuel);
    }
}

class SportsCar extends Vehicle {
    SportsCar(String n) { super(n); }
    String type() { return "SportsCar"; }
    int fuelPerKm() { return 2; }
}

class Truck extends Vehicle {
    Truck(String n) { super(n); }
    String type() { return "Truck"; }
    int fuelPerKm() { return 5; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String n) { super(n); }
    String type() { return "Motorcycle"; }
    int fuelPerKm() { return 1; }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Linerunner";
        String name3 = "Angel";
        int km1 = 15;
        int km2 = 15;
        int km3 = 20;
        int km4 = 15;

        Vehicle[] garage = new Vehicle[3];
        garage[0] = new SportsCar(name1);
        garage[1] = new Truck(name2);
        garage[2] = new Motorcycle(name3);
        garage[0].drive(km1);
        garage[1].drive(km2);
        garage[1].drive(km3);
        garage[2].drive(km4);
        System.out.println(garage[0]);
        System.out.println(garage[1]);
        System.out.println(garage[2]);
    }
}
