interface Vehicle {
    String name();
    int speed();

    default String describe() {
        return name() + " goes " + speed() + " km/h" + (speed() >= 200 ? ", fast" : "");
    }
}

class Car implements Vehicle {
    String n; int s;
    Car(String n, int s) { this.n = n; this.s = s; }
    public String name() { return n; }
    public int speed() { return s; }
}

class Boat implements Vehicle {
    String n; int s;
    Boat(String n, int s) { this.n = n; this.s = s; }
    public String name() { return n; }
    public int speed() { return s; }
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
