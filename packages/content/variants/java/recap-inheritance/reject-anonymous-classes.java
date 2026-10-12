abstract class Vehicle {
    String name;
    int fuel = 100;

    Vehicle(String name) {
        this.name = name;
    }

    abstract String type();

    abstract int fuelPerKm();

    void drive(int km) {
        if (km * fuelPerKm() > fuel) {
            System.out.println("Not enough fuel!");
            return;
        }
        fuel -= km * fuelPerKm();
    }

    public String toString() {
        return name + " (" + type() + ") - Fuel: " + fuel + "%";
    }
}

public class Main {
    static Vehicle SportsCar(String name) {
        return new Vehicle(name) {
            String type() { return "SportsCar"; }
            int fuelPerKm() { return 2; }
        };
    }

    static Vehicle Truck(String name) {
        return new Vehicle(name) {
            String type() { return "Truck"; }
            int fuelPerKm() { return 5; }
        };
    }

    static Vehicle Motorcycle(String name) {
        return new Vehicle(name) {
            String type() { return "Motorcycle"; }
            int fuelPerKm() { return 1; }
        };
    }

    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Linerunner";
        String name3 = "Angel";
        int km1 = 15;
        int km2 = 15;
        int km3 = 20;
        int km4 = 15;

        Vehicle[] fleet = { SportsCar(name1), Truck(name2), Motorcycle(name3) };
        fleet[0].drive(km1);
        fleet[1].drive(km2);
        fleet[1].drive(km3);
        fleet[2].drive(km4);
        for (Vehicle v : fleet) {
            System.out.println(v);
        }
    }
}
