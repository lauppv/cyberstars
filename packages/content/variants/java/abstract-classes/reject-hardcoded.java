abstract class Vehicle {
    String name;
    Vehicle(String name) { this.name = name; }
    abstract int topSpeed();
}

class SportsCar extends Vehicle {
    SportsCar(String name) { super(name); }
    int topSpeed() { return 240; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
    int topSpeed() { return 200; }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        new SportsCar(name1);
        new Motorcycle(name2);
        System.out.println("Infernus: 240 km/h");
        System.out.println("Angel: 200 km/h");
    }
}
