```java
abstract class Vehicle {
    String name;
    int fuel = 100;

    Vehicle(String name) {
        this.name = name;
    }

    abstract String type();
    abstract int fuelPerKm();

    void drive(int km) {
        int needed = km * fuelPerKm();
        if (needed > fuel) {
            System.out.println("Not enough fuel!");
            return;
        }
        fuel -= needed;
    }

    @Override
    public String toString() {
        return name + " (" + type() + ") - Fuel: " + fuel + "%";
    }
}

class SportsCar extends Vehicle {
    SportsCar(String name) { super(name); }
    @Override
    String type() { return "SportsCar"; }
    @Override
    int fuelPerKm() { return 2; }
}

class Truck extends Vehicle {
    Truck(String name) { super(name); }
    @Override
    String type() { return "Truck"; }
    @Override
    int fuelPerKm() { return 5; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
    @Override
    String type() { return "Motorcycle"; }
    @Override
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

        Vehicle[] fleet = {
            new SportsCar(name1),
            new Truck(name2),
            new Motorcycle(name3)
        };

        fleet[0].drive(km1);
        fleet[1].drive(km2);
        fleet[1].drive(km3);
        fleet[2].drive(km4);

        for (Vehicle v : fleet) {
            System.out.println(v);
        }
    }
}
```
