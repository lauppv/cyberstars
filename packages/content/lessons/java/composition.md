Inheritance says a class **is a** kind of another class: a Driver is a CrewMember. But many things aren't a kind of something, they **have** something. A car isn't an engine, it has an engine. Building a class out of other objects is called **composition**

---

You just give the class a field whose type is another class

```java
class Engine {
    int power;

    Engine(int power) {
        this.power = power;
    }
}

class Car {
    String model;
    Engine engine;

    Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }

    int topSpeed() {
        return engine.power / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car("Infernus", new Engine(480));
        System.out.println(car.model + " goes " + car.topSpeed());
    }
}
```

Output

```text
Infernus goes 240
```

The Car doesn't know how fast it is on its own. It asks its engine. Handing a job to an object you hold is called **delegation**

---

The nice part: the parts can change while the program runs. Put a stronger engine in, and the car is faster, with no new class

```java
class Engine {
    int power;

    Engine(int power) {
        this.power = power;
    }
}

class Car {
    String model;
    Engine engine;

    Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }

    int topSpeed() {
        return engine.power / 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car("Sentinel", new Engine(300));
        System.out.println(car.topSpeed());
        car.engine = new Engine(400);
        System.out.println(car.topSpeed());
    }
}
```

Output

```text
150
200
```

With inheritance this would be hard: a car can't stop being a `SlowCar` and become a `FastCar` halfway through the program

---

How to choose? Say it out loud:

- "a Driver **is a** CrewMember": inheritance fits
- "a Car **has an** Engine", "a Gang **has** members": composition fits

When you are not sure, programmers usually pick composition. It keeps classes small and easy to change

---

## Mission: Boat Shop

Tommy runs a boat shop. Write a class `Engine` with an `int power`, and a class `Boat` that has a `String name` and an `Engine`. A boat's speed in knots is its engine's power divided by 10, with no decimals. Give `Boat` a method `speed()` that asks its engine, and a method `swapEngine(Engine newEngine)` that puts a new engine in.

Don't use `extends`: a boat isn't an engine.

In `main`, store the boat's name in a `String` named `name` and the power of the two engines in `int` variables named `power1` and `power2`. Build the boat with the first engine and print `<name>: <speed> knots`. Then swap in the second engine and print the same line again.

**Example** for `name = "Squalo"`, `power1 = 300` and `power2 = 450`

```text
Squalo: 30 knots
Squalo: 45 knots
```

**Example** for `name = "Reefer"`, `power1 = 95` and `power2 = 40`

```text
Reefer: 9 knots
Reefer: 4 knots
```
