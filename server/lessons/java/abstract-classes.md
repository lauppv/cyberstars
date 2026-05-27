Sometimes you want a class that's a **blueprint** — it defines what child classes MUST do, but it can't be used on its own. That's an **abstract class**

Think of it this way: "Vehicle" is a concept. You can't just build a generic "vehicle" — you build a car, a truck, a motorcycle. But they all share the idea of being a vehicle. In Java, you'd make Vehicle **abstract**

```java
abstract class Vehicle {
    String name;

    Vehicle(String name) {
        this.name = name;
    }

    abstract String fuelType();  // no body! children MUST implement this

    void honk() {
        System.out.println(name + " goes BEEP!");
    }
}
```

Two key things here:

- The class is marked `abstract` — you CANNOT do `new Vehicle("something")`
- The method `fuelType()` is marked `abstract` — it has NO body (no curly braces), just a semicolon. Any non-abstract child MUST provide the body

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
    abstract String fuelType();
}

class ElectricCar extends Vehicle {
    ElectricCar(String name) {
        super(name);
    }

    @Override
    String fuelType() {
        return "Electric";
    }
}

class GasTruck extends Vehicle {
    GasTruck(String name) {
        super(name);
    }

    @Override
    String fuelType() {
        return "Gasoline";
    }
}

public class Main {
    public static void main(String[] args) {
        ElectricCar tesla = new ElectricCar("Tesla Model 3");
        GasTruck truck = new GasTruck("Ford F-150");
        System.out.println(tesla.name + ": " + tesla.fuelType());
        System.out.println(truck.name + ": " + truck.fuelType());
    }
}
```

Output

```text
Tesla Model 3: Electric
Ford F-150: Gasoline
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

    // Abstract — each character fights differently
    abstract void attack();

    // Concrete — all characters take damage the same way
    void takeDamage(int amount) {
        health -= amount;
        System.out.println(name + " takes " + amount + " damage! HP: " + health);
    }
}
```

Tommy Vercetti and Lance Vance would both extend `Character`. They'd each have their own `attack()` style, but `takeDamage()` works the same for everyone

---

**When to use abstract class vs regular class?**

Use a **regular class** when it makes sense to create objects of that type directly. A `Dog` is a real thing — you can create one

Use an **abstract class** when the class is just a concept or category. "Shape" is abstract — there's no such thing as a generic shape. "Animal" could go either way depending on your design

The rule of thumb: if you'd never want someone to write `new YourClass()`, make it abstract

---

In Python, there's no built-in `abstract` keyword — you'd use the `abc` module. Java makes it a first-class feature because Java loves being explicit about everything

---

Your turn! Create an abstract class `Vehicle` with a `name` field, a constructor, and an abstract method `fuelType()` that returns a String. Create `ElectricCar` that returns "Electric" and `GasTruck` that returns "Gasoline". In main, create an ElectricCar named "Tesla" and a GasTruck named "Ford". Print each vehicle's name and fuel type in the format "Name: FuelType"
