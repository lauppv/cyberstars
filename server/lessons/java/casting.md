When working with data, sometimes you need to convert a value from one type to another — a decimal price turned into a whole number, or a general object treated as a specific type. This conversion is called **casting**. Java cares a lot about whether the conversion is safe — and forces you to be explicit when it's not

---

**Widening** (safe, automatic): going from a smaller type to a larger one. No data is lost

```java
public class Main {
    public static void main(String[] args) {
        int x = 42;
        double y = x;  // int -> double, automatic
        System.out.println(y);
    }
}
```

Output

```text
42.0
```

Java does this automatically because a `double` can hold any `int` value. It's like pouring a small cup of water into a big bucket — nothing spills

The widening chain: `byte -> short -> int -> long -> float -> double`

---

**Narrowing** (dangerous, manual): going from a larger type to a smaller one. Data could be lost, so Java forces you to be explicit

```java
public class Main {
    public static void main(String[] args) {
        double price = 9.99;
        int rounded = (int) price;  // explicit cast
        System.out.println(rounded);
    }
}
```

Output

```text
9
```

`(int)` is the cast operator. You're telling Java "I know this might lose data, do it anyway." Without it, Java refuses to compile

Converting a double to int **truncates** (chops off the decimal), it doesn't round. `9.99` becomes `9`, not `10`. If you want real rounding, use `Math.round()`

---

Casting also works with **objects** in inheritance hierarchies

```java
class Animal {
    void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    void fetch() { System.out.println("Fetching the ball!"); }
}
```

**Upcasting** (child to parent) — always safe, automatic:

```java
public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        Animal a = d;  // automatic, like widening
        a.speak();  // works
        // a.fetch();  // WON'T COMPILE -- Animal doesn't know about fetch()
    }
}
```

**Downcasting** (parent to child) — dangerous, manual:

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();      // the object IS a Dog
        Dog d = (Dog) a;           // explicit cast, like narrowing
        d.fetch();                 // works, the object really is a Dog
    }
}
```

Output

```text
Fetching the ball!
```

But if the object isn't actually a `Dog`, you get a **ClassCastException** at runtime. That's why you check first with **instanceof**

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Animal();
        if (a instanceof Dog) {
            Dog d = (Dog) a;
            d.fetch();
        } else {
            System.out.println("Not a dog");
        }
    }
}
```

Output

```text
Not a dog
```

`instanceof` returns `true` only if the object really is that type. It's like an identity check — verify before you act

---

Quick reference

| Conversion    | Direction   | Safe?               | Syntax             |
| ------------- | ----------- | ------------------- | ------------------ |
| int to double | Widening    | Yes                 | `double d = x;`    |
| double to int | Narrowing   | No (loses decimals) | `int i = (int) d;` |
| Dog to Animal | Upcasting   | Yes                 | `Animal a = d;`    |
| Animal to Dog | Downcasting | Maybe               | `Dog d = (Dog) a;` |

---

## Mission: The Vice City Crew

Tommy has a crew of people in Vice City. Everyone has a name, but some are drivers and know how to handle a specific car. Lance Vance drives an Infernus, Mercedes Cortez doesn't drive, and Hilary King drives a Sentinel

Build a base class for crew members and a derived class for drivers. In `main`, create a few mixed members, iterate through them, and use `instanceof` to show the car only for drivers

**Example**

```text
Name: Lance Vance
Car: Infernus
Name: Mercedes Cortez
Name: Hilary King
Car: Sentinel
```
