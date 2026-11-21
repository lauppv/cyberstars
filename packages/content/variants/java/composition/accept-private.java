class Engine {
    private final int power;
    Engine(int power) { this.power = power; }
    int getPower() { return power; }
}

class Boat {
    private final String name;
    private Engine engine;
    Boat(String name, Engine engine) { this.name = name; this.engine = engine; }
    int speed() { return engine.getPower() / 10; }
    void swapEngine(Engine newEngine) { this.engine = newEngine; }
    String line() { return name + ": " + speed() + " knots"; }
}

public class Main {
    public static void main(String[] args) {
        String name = "Squalo";
        int power1 = 300;
        int power2 = 450;
        Boat boat = new Boat(name, new Engine(power1));
        System.out.println(boat.line());
        boat.swapEngine(new Engine(power2));
        System.out.println(boat.line());
    }
}
