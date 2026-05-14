You know how to write methods with `static` — those belong to the class itself. But when you're building objects, you usually want methods that belong to **each object**. These are called **instance methods**, and they don't use the `static` keyword

---

## Instance Methods

```java
class Dog {
    String name;

    Dog(String name) {
        this.name = name;
    }

    void bark() {
        System.out.println(name + " says: Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d1 = new Dog("Rex");
        Dog d2 = new Dog("Buddy");
        d1.bark();
        d2.bark();
    }
}
```
Output
```text
Rex says: Woof!
Buddy says: Woof!
```

Notice: `bark()` has **no `static`** keyword. That's because it's an instance method — it operates on a specific dog. When you call `d1.bark()`, Java knows `name` refers to `d1`'s name

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

Each call to `completeMission()` modifies **that specific object's** `respect` field. If we had another `GangMember`, their respect would be separate

---

## Static vs Instance — The Key Difference

Here's the rule:

- **Static methods** belong to the **class**. You call them with the class name: `Math.max(5, 10)`
- **Instance methods** belong to an **object**. You call them on a variable: `tommy.completeMission()`

Static methods can't access instance fields (because there's no object). Instance methods can access everything

```java
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

## Python Comparison

In Python, instance methods take `self` as the first parameter:
```python
class Dog:
    def bark(self):
        print(f"{self.name} says: Woof!")
```

In Java, `this` is always available inside instance methods — you don't need to list it as a parameter. And you only need `this.` when there's a naming conflict

---

## Exercise

Create a `Counter` class with:
- An `int` field called `count`, starting at 0
- A constructor that sets `count` to 0
- An `increment()` method that adds 1 to `count`
- A `getCount()` method that returns the current `count`

In `main`, create a `Counter`, call `increment()` three times, then print the count

Expected output:
```text
3
```
