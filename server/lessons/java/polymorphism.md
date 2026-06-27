Polymorphism is a fancy word that means "many forms." In Java, it means a variable of a **parent** type can hold an object of any **child** type — and Java will call the RIGHT method automatically

```java
class Criminal {
    String name;
    Criminal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}

class Driver extends Criminal {
    Driver(String name) { super(name); }
    @Override
    void speak() { System.out.println("I'm the driver " + name); }
}

class Gunman extends Criminal {
    Gunman(String name) { super(name); }
    @Override
    void speak() { System.out.println("I'm the gunman " + name); }
}

public class Main {
    public static void main(String[] args) {
        Criminal c = new Driver("Tommy");  // parent type, child object
        c.speak();  // prints "I'm the driver Tommy" not "..."
    }
}
```

Even though `c` is declared as `Criminal`, Java knows it's actually a `Driver` at runtime and calls Driver's `speak()`. This is called **dynamic dispatch** — Java dispatches the method call to the actual object type, not the declared type

---

This gets REALLY powerful with arrays and loops. Think about Vice City: you have different types of criminals — all extending the base `Criminal` class. You can store them all in ONE array

```java
class Criminal {
    String name;
    Criminal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}

class Driver extends Criminal {
    Driver(String name) { super(name); }
    @Override
    void speak() { System.out.println("I'm the driver " + name); }
}

class Gunman extends Criminal {
    Gunman(String name) { super(name); }
    @Override
    void speak() { System.out.println("I'm the gunman " + name); }
}

public class Main {
    public static void main(String[] args) {
        Criminal[] crew = { new Driver("Tommy"), new Gunman("Lance") };

        for (Criminal c : crew) {
            c.speak();
        }
    }
}
```

Output

```text
I'm the driver Tommy
I'm the gunman Lance
```

We never checked "is this a driver or a gunman?" — Java figured it out for us. The loop just calls `c.speak()` and Java routes it to the correct override. That's polymorphism in action

---

Sometimes you need to check what type an object actually is. Java has the **instanceof** keyword for that

```java
public class Main {
    public static void main(String[] args) {
        Criminal c = new Driver("Tommy");

        if (c instanceof Driver) {
            System.out.println("It's a driver!");
        }
    }
}
```

This is useful when you need to access child-specific methods. But in general, if you're using `instanceof` a lot, you might be fighting against polymorphism instead of using it. The whole point is to NOT care about the specific type

---

Here's why this matters in real code. Imagine a method that takes any `Criminal`

```java
public class Main {
    static void present(Criminal c) {
        c.speak();
    }
}
```

You can pass a Driver, a Gunman, a Boss — anything that extends Criminal. The method doesn't need to know or care. That's the power. One method handles ALL criminals, current and future

Like Cortez in Vice City — he gives missions to Tommy, Lance, whoever. He doesn't care about the specific person, just that they can do the job. The "job" is the method signature, and polymorphism makes sure the right person does it their way

---

## Mission: Gang Roll Call

Tommy calls his crew for a roll call. Each member answers their own way, but you want a single loop that makes them all speak — without checking what type each one is.

Create the `Criminal`, `Driver`, and `Gunman` classes (Criminal has `speak()` printing `"..."`; Driver overrides with `"I'm the driver "` + name; Gunman overrides with `"I'm the gunman "` + name).

In `main`, create a `Criminal[]` array containing a `Driver` named `"Tommy"` and a `Gunman` named `"Lance"`. Loop through the array and call `speak()` on each.

**Example**

```text
I'm the driver Tommy
I'm the gunman Lance
```
