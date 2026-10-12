abstract class Vehicle {
    String name;
    int fuel = 100;

    Vehicle(String name) { this.name = name; }

    abstract String type();
    abstract int fuelPerKm();

    void drive(int km) {
        if (fuel >= km * fuelPerKm()) fuel -= km * fuelPerKm();
        else System.out.println("Not enough fuel!");
    }

    public String toString() {
        return name + " (" + type() + ") - Fuel: " + fuel + "%";
    }
}

class SportsCar extends Vehicle {
    SportsCar(String name) { super(name); }
    String type() { return getClass().getSimpleName(); }
    int fuelPerKm() { return 2; }
}

class Truck extends Vehicle {
    Truck(String name) { super(name); }
    String type() { return getClass().getSimpleName(); }
    int fuelPerKm() { return 5; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
    String type() { return getClass().getSimpleName(); }
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

        Vehicle[] fleet = { new SportsCar(name1), new Truck(name2), new Motorcycle(name3) };
        int[][] trips = { {0, km1}, {1, km2}, {1, km3}, {2, km4} };
        for (int[] t : trips) fleet[t[0]].drive(t[1]);
        StringBuilder out = new StringBuilder();
        for (Vehicle v : fleet) out.append(v).append('\n');
        System.out.print(out);
    }
}
