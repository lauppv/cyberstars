abstract class Vehicle {
    abstract String name();
    abstract int speed();

    String describe() {
        return name() + " goes " + speed() + " km/h" + (speed() >= 200 ? ", fast" : "");
    }
}

class Car extends Vehicle {
    String n; int s;
    Car(String n, int s) { this.n = n; this.s = s; }
    String name() { return n; }
    int speed() { return s; }
}

class Boat extends Vehicle {
    String n; int s;
    Boat(String n, int s) { this.n = n; this.s = s; }
    String name() { return n; }
    int speed() { return s; }
    String describe() { return n + " sails at " + s + " knots"; }
}

public class Main {
    public static void main(String[] args) {
        String carName = "Infernus";
        int carSpeed = 240;
        String boatName = "Squalo";
        int boatSpeed = 95;
        System.out.println(new Car(carName, carSpeed).describe());
        System.out.println(new Boat(boatName, boatSpeed).describe());
    }
}
