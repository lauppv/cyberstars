```java
abstract class Vehicle {
    String name;
    Vehicle(String name) { this.name = name; }
    abstract int topSpeed();
}

class SportsCar extends Vehicle {
    SportsCar(String name) { super(name); }
    @Override
    int topSpeed() { return 240; }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
    @Override
    int topSpeed() { return 200; }
}

public class Main {
    public static void main(String[] args) {
        SportsCar infernus = new SportsCar("Infernus");
        Motorcycle angel = new Motorcycle("Angel");
        System.out.println(infernus.name + ": " + infernus.topSpeed() + " km/h");
        System.out.println(angel.name + ": " + angel.topSpeed() + " km/h");
    }
}
```
