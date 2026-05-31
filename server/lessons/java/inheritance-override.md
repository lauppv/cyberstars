Last lesson we saw that a child class can replace a parent's method with its own version. That's called **overriding**. Java has a special annotation for it: **@Override**

```java
class Animal {
    void speak() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Woof!");
    }
}
```

The `@Override` annotation isn't technically required — your code compiles without it. But you should **always** use it. Here's why: if you accidentally misspell the method name, Java will think you're creating a NEW method instead of overriding the old one. With `@Override`, Java checks that the parent actually has that method and yells at you if it doesn't

```java
class Dog extends Animal {
    @Override
    void speek() {  // TYPO! Compiler error because Animal has no speek()
        System.out.println("Woof!");
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
class Animal {
    void speak() { ... }
}
class Dog extends Animal {
    @Override
    void speak() { ... }  // OVERRIDING — replaces parent's speak()
}
```

**Overloading**: same class has multiple methods with the same name but DIFFERENT parameters

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    double add(double a, double b) {  // OVERLOADING — different param types
        return a + b;
    }
    int add(int a, int b, int c) {  // OVERLOADING — different param count
        return a + b + c;
    }
}
```

Overriding = between parent and child, same signature. Overloading = same class, different signatures. Don't mix them up on a test :)

---

Here's a full example with shapes

```java
class Shape {
    double area() {
        return 0;
    }
}

class Circle extends Shape {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    double width, height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double area() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Circle c = new Circle(5);
        Rectangle r = new Rectangle(4, 6);
        System.out.println("Circle area: " + String.format("%.2f", c.area()));
        System.out.println("Rectangle area: " + r.area());
    }
}
```

Output

```text
Circle area: 78.54
Rectangle area: 24.0
```

---

## Mission: Hull Plate Calculator

The station's engineering team is replacing hull plates of different shapes. They need a program that calculates the area of each plate so they can order the right amount of material.

Create a `Shape` class with an `area()` method that returns `0`. Then create two child classes:

1. `Circle` — has a `double radius` field, overrides `area()` to return `Math.PI * radius * radius`
2. `Rectangle` — has `double width` and `double height` fields, overrides `area()` to return `width * height`

Use `@Override` on both. In `main`, create a Circle with radius `5` and a Rectangle with width `4` and height `6`. Print each area with the labels shown below — use `String.format("%.2f", ...)` for the circle.

**Input** (already set in your code — change the values to test):

- `5` — circle radius
- `4`, `6` — rectangle width and height

**Example**

With the starter values, your program should print

```text
Circle area: 78.54
Rectangle area: 24.0
```
