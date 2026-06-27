Last lesson we saw that a child class can replace a parent's method with its own version. That's called **overriding**. Java has a special annotation for it: **@Override**

```java
class Criminal {
    void speak() {
        System.out.println("...");
    }
}

class Driver extends Criminal {
    @Override
    void speak() {
        System.out.println("Get in the car!");
    }
}
```

The `@Override` annotation isn't technically required — your code compiles without it. But you should **always** use it. Here's why: if you accidentally misspell the method name, Java will think you're creating a NEW method instead of overriding the old one. With `@Override`, Java checks that the parent actually has that method and yells at you if it doesn't

```java
class Driver extends Criminal {
    @Override
    void speek() {  // TYPO! Compiler error because Criminal has no speek()
        System.out.println("Get in the car!");
    }
}
```

Without `@Override`, this would silently create a useless `speek()` method and the bug would haunt you for hours. Trust me, Tommy Vercetti doesn't have time for that

---

Sometimes you don't want to REPLACE the parent's behavior — you want to ADD to it. That's where **super.method()** comes in

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle starting...");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        super.start();  // call the parent's version first
        System.out.println("Car engine revving!");
    }
}

public class Main {
    public static void main(String[] args) {
        Car c = new Car();
        c.start();
    }
}
```

Output

```text
Vehicle starting...
Car engine revving!
```

`super.start()` says "run the parent's version of start() first, THEN do my extra stuff." It's like Lance Vance doing everything a regular criminal does, plus his own side missions

---

**Overriding vs Overloading** — these sound similar but they're completely different things

**Overriding**: child class replaces a parent method (same name, same parameters)

```java
class Criminal {
    void speak() { ... }
}
class Driver extends Criminal {
    @Override
    void speak() { ... }  // OVERRIDING — replaces parent's speak()
}
```

**Overloading**: same class has multiple methods with the same name but DIFFERENT parameters

```java
class Garage {
    void repair(String car) {
        System.out.println("Repairing " + car);
    }
    void repair(String car, int hours) {  // OVERLOADING — different param count
        System.out.println("Repairing " + car + " in " + hours + " hours");
    }
}
```

Overriding = between parent and child, same signature. Overloading = same class, different signatures. Don't mix them up on a test :)

---

Here's a full example with Tommy's businesses

```java
class Business {
    int earnings() {
        return 0;
    }
}

class Club extends Business {
    int customers;

    Club(int customers) {
        this.customers = customers;
    }

    @Override
    int earnings() {
        return customers * 50;
    }
}

class CarWash extends Business {
    int cars;
    int price;

    CarWash(int cars, int price) {
        this.cars = cars;
        this.price = price;
    }

    @Override
    int earnings() {
        return cars * price;
    }
}

public class Main {
    public static void main(String[] args) {
        Club c = new Club(120);
        CarWash w = new CarWash(30, 8);
        System.out.println("Club earnings: " + c.earnings());
        System.out.println("Car wash earnings: " + w.earnings());
    }
}
```

Output

```text
Club earnings: 6000
Car wash earnings: 240
```

---

## Mission: Tommy's Business Earnings

Tommy owns several businesses in Vice City, each making money its own way. He needs a program that calculates the earnings of each one.

Create a `Business` class with an `earnings()` method that returns `0`. Then create two child classes:

1. `Club` — has an `int customers` field, overrides `earnings()` to return `customers * 50`
2. `CarWash` — has `int cars` and `int price` fields, overrides `earnings()` to return `cars * price`

Use `@Override` on both. In `main`, create a `Club` with `120` customers and a `CarWash` with `30` cars and price `8`. Print each one's earnings with the labels shown below.

**Example**

```text
Club earnings: 6000
Car wash earnings: 240
```
