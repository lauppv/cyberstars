An interface lists methods that every class implementing it must write. But sometimes most classes would write the same code. A **default method** is a method with a body, right inside the interface. Every class gets it for free, and a class that needs something different can override it

---

You put `default` in front of the method and give it a body

```java
interface Weapon {
    String name();
    int damage();

    default String describe() {
        return name() + " hits for " + damage();
    }
}

class Pistol implements Weapon {
    public String name() {
        return "Pistol";
    }

    public int damage() {
        return 25;
    }
}

public class Main {
    public static void main(String[] args) {
        Weapon w = new Pistol();
        System.out.println(w.describe());
    }
}
```

Output

```text
Pistol hits for 25
```

`Pistol` only wrote `name()` and `damage()`. It still has `describe()`, from the interface. And notice that the default method calls the other methods of the interface: it doesn't know which class it is in, but it knows every class has `name()` and `damage()`

---

A class can override a default method, just like a method it inherits

```java
interface Weapon {
    String name();
    int damage();

    default String describe() {
        return name() + " hits for " + damage();
    }
}

class Katana implements Weapon {
    public String name() {
        return "Katana";
    }

    public int damage() {
        return 40;
    }

    @Override
    public String describe() {
        return "A silent katana, " + damage() + " damage";
    }
}

public class Main {
    public static void main(String[] args) {
        Weapon w = new Katana();
        System.out.println(w.describe());
    }
}
```

Output

```text
A silent katana, 40 damage
```

---

Why does Java have this? Imagine an interface that a hundred classes already implement. Add a normal method to it, and all hundred classes stop compiling until each one writes it. Add a default method, and they all keep working

Default methods can't have fields. An interface still holds no data, only behaviour

---

## Mission: Vehicles and Boats

Write an interface `Vehicle` with two methods, `String name()` and `int speed()`, and a default method `describe()` that gives back `<name> goes <speed> km/h`, followed by `, fast` when the speed is at least 200.

Write a class `Car` that implements `Vehicle` and keeps the default `describe()`. Write a class `Boat` that implements `Vehicle` and overrides `describe()` to give back `<name> sails at <speed> knots`.

In `main`, store the car's name and speed in `carName` and `carSpeed`, and the boat's in `boatName` and `boatSpeed`. Print the car's description, then the boat's.

**Example** for `carName = "Infernus"`, `carSpeed = 240`, `boatName = "Squalo"` and `boatSpeed = 95`

```text
Infernus goes 240 km/h, fast
Squalo sails at 95 knots
```

**Example** for `carName = "Idaho"`, `carSpeed = 150`, `boatName = "Jetmax"` and `boatSpeed = 210`

```text
Idaho goes 150 km/h
Jetmax sails at 210 knots
```
