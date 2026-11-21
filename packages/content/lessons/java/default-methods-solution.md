```java
interface Vehicle {
    String name();
    int speed();

    default String describe() {
        return name() + " goes " + speed() + " km/h" + (speed() >= 200 ? ", fast" : "");
    }
}

class Car implements Vehicle {
    String name;
    int speed;

    Car(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }

    public String name() {
        return name;
    }

    public int speed() {
        return speed;
    }
}

class Boat implements Vehicle {
    String name;
    int speed;

    Boat(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }

    public String name() {
        return name;
    }

    public int speed() {
        return speed;
    }

    @Override
    public String describe() {
        return name + " sails at " + speed + " knots";
    }
}

public class Main {
    public static void main(String[] args) {
        String carName = "Infernus";
        int carSpeed = 240;
        String boatName = "Squalo";
        int boatSpeed = 95;

        Vehicle car = new Car(carName, carSpeed);
        Vehicle boat = new Boat(boatName, boatSpeed);
        System.out.println(car.describe());
        System.out.println(boat.describe());
    }
}
```
