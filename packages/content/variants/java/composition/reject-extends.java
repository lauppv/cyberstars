class Engine {
    int power;
    Engine(int power) { this.power = power; }
}

class Boat extends Engine {
    String name;
    Boat(String name, Engine engine) { super(engine.power); this.name = name; }
    int speed() { return power / 10; }
    void swapEngine(Engine newEngine) { power = newEngine.power; }
}

public class Main {
    public static void main(String[] args) {
        String name = "Squalo";
        int power1 = 300;
        int power2 = 450;
        Boat boat = new Boat(name, new Engine(power1));
        System.out.println(boat.name + ": " + boat.speed() + " knots");
        boat.swapEngine(new Engine(power2));
        System.out.println(boat.name + ": " + boat.speed() + " knots");
    }
}
