abstract class Vehicle {
    String name;
    Vehicle(String name) { this.name = name; }
    abstract int topSpeed();
}

class SportsCar extends Vehicle {
    SportsCar(String name) { super(name); }
    int topSpeed() { return 200; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
    int topSpeed() { return 240; }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        Vehicle a = new SportsCar(name1);
        Vehicle b = new Motorcycle(name2);
        System.out.println(a.name + ": " + a.topSpeed() + " km/h");
        System.out.println(b.name + ": " + b.topSpeed() + " km/h");
    }
}
