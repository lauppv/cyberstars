What happens when you try to print an object directly?

```java
class Car {
    String make;
    int year;

    Car(String make, int year) {
        this.make = make;
        this.year = year;
    }
}

public class Main {
    public static void main(String[] args) {
        Car c = new Car("Infernus", 1986);
        System.out.println(c);
    }
}
```

Output

```text
Car@6d06d69c
```

That's... not helpful. Java doesn't know how you want your object displayed, so it gives you the class name and some memory address. To fix this, we **override** a special method called `toString()`

---

## Overriding toString()

Every object in Java has a `toString()` method (inherited from a base class called `Object`). By default it prints that ugly gibberish. But you can **override** it — write your own version:

```java
class Car {
    String make;
    int year;

    Car(String make, int year) {
        this.make = make;
        this.year = year;
    }

    @Override
    public String toString() {
        return make + " (" + year + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Car c = new Car("Infernus", 1986);
        System.out.println(c);
    }
}
```

Output

```text
Infernus (1986)
```

Now when you print the object, Java calls your `toString()` and uses whatever string you return

---

## The @Override Annotation

That `@Override` thing above the method is an **annotation**. It tells Java "I'm intentionally replacing a method from the parent class." It's optional but strongly recommended because:

- If you accidentally misspell the method (like `tostring()` with a lowercase S), Java will give you an error instead of silently creating a new method that does nothing
- It makes your code clearer to anyone reading it

```java
public class Main {
    @Override
    public String toString() {   // Java checks: does the parent have toString()? Yes. Good.
        return "something";
    }
}
```

---

## toString() Is Called Automatically

Java calls `toString()` in several situations automatically:

```java
class Weapon {
    String name;
    int damage;

    Weapon(String name, int damage) {
        this.name = name;
        this.damage = damage;
    }

    @Override
    public String toString() {
        return name + " (damage: " + damage + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Weapon w = new Weapon("Katana", 75);

        // All of these call toString() automatically:
        System.out.println(w);                    // direct print
        System.out.println("Weapon: " + w);       // string concatenation
        String s = "Got a " + w;                   // building a string
        System.out.println(s);
    }
}
```

Output

```text
Katana (damage: 75)
Weapon: Katana (damage: 75)
Got a Katana (damage: 75)
```

Whenever Java needs to turn your object into a `String`, it calls `toString()`. Concatenation with `+` does this, `println()` does this — it's everywhere

---

## Python Comparison

In Python, the equivalent is `__str__`:

```python
class Car:
    def __str__(self):
        return f"{self.make} ({self.year})"
```

Same idea — Java just calls it `toString()` and uses `@Override` instead of dunder methods

---

## A More Detailed Example

Tommy Vercetti's squad needs proper string representations:

```java
class GangMember {
    String name;
    String role;
    int respect;

    GangMember(String name, String role, int respect) {
        this.name = name;
        this.role = role;
        this.respect = respect;
    }

    @Override
    public String toString() {
        return name + " - " + role + " (Respect: " + respect + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        GangMember t = new GangMember("Tommy Vercetti", "Boss", 100);
        GangMember l = new GangMember("Lance Vance", "Partner", 60);
        System.out.println(t);
        System.out.println(l);
    }
}
```

Output

```text
Tommy Vercetti - Boss (Respect: 100)
Lance Vance - Partner (Respect: 60)
```

---

## Exercise

Create a `Car` class with `make` (String) and `year` (int) fields. Write a constructor and override `toString()` to return the format `Make (Year)`.

Create two cars and print them:

- `"Infernus"`, year `1986`
- `"Cheetah"`, year `1984`

Expected output:

```text
Infernus (1986)
Cheetah (1984)
```
