You know how to write methods with `static` — those belong to the class itself. But when you're building objects, you usually want methods that belong to **each object**. These are called **instance methods**, and they don't use the `static` keyword

---

## Instance Methods

```java
class Car {
    String model;

    Car(String model) {
        this.model = model;
    }

    void honk() {
        System.out.println(model + " goes: Beep!");
    }
}

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car("Infernus");
        Car c2 = new Car("Cheetah");
        c1.honk();
        c2.honk();
    }
}
```

Output

```text
Infernus goes: Beep!
Cheetah goes: Beep!
```

Notice: `honk()` has **no `static`** keyword. That's because it's an instance method — it operates on a specific car. When you call `c1.honk()`, Java knows `model` refers to `c1`'s model

---

## Methods That Return Values

Instance methods can return values just like static ones:

```java
class Wallet {
    int cash;

    Wallet(int cash) {
        this.cash = cash;
    }

    int getCash() {
        return cash;
    }

    void addCash(int amount) {
        cash += amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Wallet w = new Wallet(50);
        w.addCash(30);
        System.out.println("Cash: " + w.getCash());
    }
}
```

Output

```text
Cash: 80
```

The pattern: `void` means the method does something but returns nothing. A return type like `int` means it gives back a value

---

## Methods That Modify the Object

This is where it gets powerful. Methods can change the object's own fields:

```java
class GangMember {
    String name;
    int respect;

    GangMember(String name) {
        this.name = name;
        this.respect = 0;
    }

    void completeMission() {
        respect += 10;
        System.out.println(name + " completed a mission! Respect: " + respect);
    }
}

public class Main {
    public static void main(String[] args) {
        GangMember tommy = new GangMember("Tommy Vercetti");
        tommy.completeMission();
        tommy.completeMission();
        tommy.completeMission();
    }
}
```

Output

```text
Tommy Vercetti completed a mission! Respect: 10
Tommy Vercetti completed a mission! Respect: 20
Tommy Vercetti completed a mission! Respect: 30
```

Let's trace what happens to `tommy`:

- At creation, the constructor sets `respect` to `0`
- First `completeMission()`: `respect` rises to `10`, then the line with `Respect: 10` is printed
- The second call starts from `10` and reaches `20`
- The third starts from `20` and reaches `30`

Each call to `completeMission()` modifies **that specific object's** `respect` field. If we had another `GangMember`, their respect would be separate

---

## Static vs Instance — The Key Difference

Here's the rule:

- **Static methods** belong to the **class**. You call them with the class name: `Math.max(5, 10)`
- **Instance methods** belong to an **object**. You call them on a variable: `tommy.completeMission()`

Static methods can't access instance fields (because there's no object). Instance methods can access everything

```text
class Example {
    int x = 10;          // instance field

    void show() {        // instance method — can use x
        System.out.println(x);
    }

    static void greet() { // static method — CANNOT use x
        System.out.println("Hello");
        // System.out.println(x);  // ERROR! No object, no x
    }
}
```

That's why `main` is `static` — it runs before any objects exist. It's the starting point, and from there you create objects and call their methods

---

## Mission: Business Earnings

Tommy owns several businesses in Vice City. Each business has a name and a total of earnings that starts at 0. Every time the business brings in money, the total grows

Create a class that represents a business, with a field for the name and one for the total earnings. Write a method that adds an amount to the total and a method that returns the current total

In `main`, store the first business's name in `name1` and its two takings in `sale1` and `sale2`; store the second's name in `name2` and its two takings in `sale3` and `sale4`. Create **two** businesses from those variables, add each business's two takings, then print for each business the name, then `: `, then the total — for example `Malibu Club: 500`

**Example** — `Malibu Club` with takings 200, 300 and `Print Works` with 500, 250

```text
Malibu Club: 500
Print Works: 750
```

**Example** — `Cherry Popper` with takings 100, 100 and `Sunshine Autos` with 700, 300

```text
Cherry Popper: 200
Sunshine Autos: 1000
```
