```java
class Engine {
    int power;

    Engine(int power) {
        this.power = power;
    }
}

class Boat {
    String name;
    Engine engine;

    Boat(String name, Engine engine) {
        this.name = name;
        this.engine = engine;
    }

    int speed() {
        return engine.power / 10;
    }

    void swapEngine(Engine newEngine) {
        engine = newEngine;
    }
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
```
