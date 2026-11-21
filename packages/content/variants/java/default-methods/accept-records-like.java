interface Vehicle {
    String name();
    int speed();

    default String describe() {
        String line = name() + " goes " + speed() + " km/h";
        if (speed() >= 200) {
            line = line + ", fast";
        }
        return line;
    }
}

class Car implements Vehicle {
    private final String n;
    private final int s;
    Car(String n, int s) { this.n = n; this.s = s; }
    public String name() { return n; }
    public int speed() { return s; }
}

class Boat implements Vehicle {
    private final String n;
    private final int s;
    Boat(String n, int s) { this.n = n; this.s = s; }
    public String name() { return n; }
    public int speed() { return s; }
    public String describe() { return name() + " sails at " + speed() + " knots"; }
}

public class Main {
    public static void main(String[] args) {
        String carName = "Infernus";
        int carSpeed = 240;
        String boatName = "Squalo";
        int boatSpeed = 95;
        Vehicle[] all = { new Car(carName, carSpeed), new Boat(boatName, boatSpeed) };
        for (Vehicle v : all) System.out.println(v.describe());
    }
}
