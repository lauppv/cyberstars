You've been writing `public static void main` since day one but never really asked what `static` means. Time to find out

The `static` keyword means **"this belongs to the class itself, not to any individual object"**

---

## Static vs Instance Fields

Imagine a Vice City nightclub tracking visitors. Each visitor has their own name, but the **total visit count** is shared across all of them — it belongs to the club, not to any single person:

```java
class Visitor {
    String name;
    static int totalVisits = 0;

    Visitor(String name) {
        this.name = name;
        totalVisits++;
    }
}

public class Main {
    public static void main(String[] args) {
        Visitor v1 = new Visitor("Tommy");
        Visitor v2 = new Visitor("Lance");
        Visitor v3 = new Visitor("Cortez");
        System.out.println("Total visits: " + Visitor.totalVisits);
    }
}
```

Output

```text
Total visits: 3
```

Notice a few things:

- `totalVisits` is `static` — there's only **one copy** shared by all Visitor objects
- Each time we create a new Visitor, the constructor bumps `totalVisits` by 1
- We access it with `Visitor.totalVisits` (the class name), not `v1.totalVisits`

Meanwhile, `name` is an instance field — each visitor has their own

---

## Static Methods

Static methods belong to the class too. You've been using them all along:

```java
public class Main {
    public static void main(String[] args) {
        int bigger = Math.max(10, 20);   // Math is the class, max is a static method
    }
}
```

You don't create a `Math` object to use `max()`. It's a utility that doesn't need any object state

Here's how to write your own:

```java
class MathHelper {
    static int square(int n) {
        return n * n;
    }

    static int add(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathHelper.square(5));
        System.out.println(MathHelper.add(3, 7));
    }
}
```

Output

```text
25
10
```

No objects needed. Call them on the class directly

---

## Why Is main() Static?

When your program starts, no objects exist yet. Java needs a way to begin execution without creating an object first. That's why `main` is `static` — it's a class-level method that runs without needing an instance

```java
public class Main {
    public static void main(String[] args) {
        // This runs first. No objects exist yet.
        // From here, you CREATE objects and call their methods.
    }
}
```

---

## Static Cannot Access Instance

A static method has no `this` — there's no object associated with it. So it **cannot** access instance fields or instance methods:

```java
class Example {
    int x = 10;           // instance field
    static int y = 20;    // static field

    static void show() {
        System.out.println(y);   // OK — y is static
        // System.out.println(x); // ERROR — x needs an object
    }

    void display() {
        System.out.println(x);   // OK — instance method has an object
        System.out.println(y);   // OK — static fields are always accessible
    }
}
```

The rule: **instance can access static, but static cannot access instance**. Think of it like this: the class exists even when no objects do, so static code can't assume any object is around

---

## Counting Instances — A Classic Pattern

Using a static field to track how many objects have been created is one of the most common static patterns:

```java
class Enemy {
    String type;
    static int enemyCount = 0;

    Enemy(String type) {
        this.type = type;
        enemyCount++;
    }
}

public class Main {
    public static void main(String[] args) {
        Enemy e1 = new Enemy("Goon");
        Enemy e2 = new Enemy("Boss");
        Enemy e3 = new Enemy("Sniper");
        Enemy e4 = new Enemy("Goon");
        System.out.println("Enemies spawned: " + Enemy.enemyCount);
    }
}
```

Output

```text
Enemies spawned: 4
```

---

## Python Comparison

Python has class variables (similar to static fields) and `@staticmethod`:

```python
class Visitor:
    total_visits = 0  # class variable (shared)

    def __init__(self, name):
        self.name = name  # instance variable
        Visitor.total_visits += 1
```

Same concept — the class variable belongs to the class, not to any instance

---

## Exercise

Create a `Visitor` class with:

- A `String name` instance field
- A `static int totalVisits` field starting at 0
- A constructor that takes a name and increments `totalVisits`

In `main`, create 3 visitors: `"Tommy"`, `"Lance"`, and `"Cortez"`. Then print the total visits

Expected output:

```text
3
```
