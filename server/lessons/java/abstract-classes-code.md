abstract class Vehicle {
    String name;

    Vehicle(String name) {
        this.name = name;
    }

    abstract String fuelType();
}

// Create an ElectricCar class that extends Vehicle
// fuelType() should return "Electric"


// Create a GasTruck class that extends Vehicle
// fuelType() should return "Gasoline"


public class Main {
    public static void main(String[] args) {
        // Create an ElectricCar named "Tesla"
        // Create a GasTruck named "Ford"
        // Print: "Tesla: Electric"
        // Print: "Ford: Gasoline"

    }
}
