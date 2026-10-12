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
        String name1 = "Infernus";
        String name2 = "Angel";

        SportsCar infernus = new SportsCar(name1);
        Motorcycle angel = new Motorcycle(name2);
        System.out.println(infernus.name + ": " + infernus.topSpeed() + " km/h");
        System.out.println(angel.name + ": " + angel.topSpeed() + " km/h");
    }
}
```
