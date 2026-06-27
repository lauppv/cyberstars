Sometimes you want a class that's a **blueprint** — it defines what child classes MUST do, but it can't be used on its own. That's an **abstract class**

Think of it this way: "Vehicle" is a concept. You can't just build a generic "vehicle" — you build a sports car, a motorcycle, a truck. But they all share the idea of being a vehicle. In Java, you'd make Vehicle **abstract**

```java
abstract class Vehicle {
    String name;

    Vehicle(String name) {
        this.name = name;
    }

    abstract int topSpeed();  // no body! children MUST implement this

    void honk() {
        System.out.println(name + " goes BEEP!");
    }
}
```

Two key things here:

- The class is marked `abstract` — you CANNOT do `new Vehicle("something")`
- The method `topSpeed()` is marked `abstract` — it has NO body (no curly braces), just a semicolon. Any non-abstract child MUST provide the body

---

```java
public class Main {
    public static void main(String[] args) {
        Vehicle v = new Vehicle("test");  // COMPILER ERROR! Can't instantiate abstract class
    }
}
```

It's like trying to buy a "vehicle" at a dealership. The salesperson would say "which KIND of vehicle?" You need a concrete type

---

A child class that extends an abstract class MUST implement all abstract methods — or it has to be abstract itself

```java
abstract class Vehicle {
    String name;
    Vehicle(String name) { this.name = name; }
    abstract int topSpeed();
}

class SportsCar extends Vehicle {
    SportsCar(String name) {
        super(name);
    }

    @Override
    int topSpeed() {
        return 240;
    }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) {
        super(name);
    }

    @Override
    int topSpeed() {
        return 200;
    }
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

Output

```text
Infernus: 240 km/h
Angel: 200 km/h
```

---

An abstract class can have **both** abstract methods (that children must implement) and **regular** methods (that children inherit for free)

```java
abstract class Character {
    String name;
    int health;

    Character(String name, int health) {
        this.name = name;
        this.health = health;
    }

    // Abstract - each character fights differently
    abstract void attack();

    // Concrete - all characters take damage the same way
    void takeDamage(int amount) {
        health -= amount;
        System.out.println(name + " takes " + amount + " damage! HP: " + health);
    }
}
```

Tommy Vercetti and Lance Vance would both extend `Character`. They'd each have their own `attack()` style, but `takeDamage()` works the same for everyone

---

**When to use abstract class vs regular class?**

Use a **regular class** when it makes sense to create objects of that type directly. A `Car` is a real thing — you can create one

Use an **abstract class** when the class is just a concept or category. "Vehicle" is abstract — there's no such thing as a generic vehicle. "Character" could go either way depending on your design

The rule of thumb: if you'd never want someone to write `new YourClass()`, make it abstract

---

## Mission: Tommy's Fleet

Tommy has several vehicles in his garage, each with its own top speed. He needs a report showing every vehicle and its speed — but "Vehicle" itself is just a concept, not something you can build directly.

Create an abstract class `Vehicle` with a `String name` field, a constructor, and an abstract method `topSpeed()` that returns an int. Then create two concrete classes:

1. `SportsCar` — `topSpeed()` returns `240`
2. `Motorcycle` — `topSpeed()` returns `200`

In `main`, create a `SportsCar` named `"Infernus"` and a `Motorcycle` named `"Angel"`. Print each in the format `Name: X km/h`.

**Example**

```text
Infernus: 240 km/h
Angel: 200 km/h
```
