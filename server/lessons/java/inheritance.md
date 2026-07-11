Sometimes you want a class that's basically another class, but with extras. In Java, a class can **inherit** from another using the keyword **extends**

```text
class Criminal {
    String name;

    Criminal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("...");
    }
}

class Driver extends Criminal {
    Driver(String name) {
        super(name);
    }

    void speak() {
        System.out.println("I'm the driver " + name + ", get in the car!");
    }
}
```

The `Driver` class **inherits** everything from `Criminal` — its `name` field, its constructor logic, everything. Then it **overrides** the `speak()` method to do its own thing. This is **inheritance** — one of the biggest ideas in Java

---

An example from Vice City: Tommy Vercetti is a **criminal** (the parent class). Lance Vance is also a criminal, but he's a _specific kind_ — a backstabbing criminal. He **extends** the base criminal class with his own special behavior (betrayal). He still has all the base criminal abilities, plus his own twist

---

The **super** keyword is how a child talks to its parent. When `Driver` calls `super(name)`, it's saying "hey Criminal, run YOUR constructor with this name." The parent constructor sets `this.name = name`, and now the driver has a name

You **must** call `super(...)` in the child constructor if the parent doesn't have a no-argument constructor. Java won't let you skip it — the parent needs to be set up before the child can add its own stuff

```text
class Criminal {
    String name;
    int respect;

    Criminal(String name, int respect) {
        this.name = name;
        this.respect = respect;
    }
}

class Boss extends Criminal {
    Boss(String name) {
        super(name, 100);  // a boss always starts with max respect
    }
}
```

---

A child class can also **add** new fields and methods that the parent doesn't have

```text
class Criminal {
    String name;

    Criminal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("...");
    }
}

class Driver extends Criminal {
    String car;

    Driver(String name, String car) {
        super(name);
        this.car = car;
    }

    void speak() {
        System.out.println("I'm the driver " + name);
    }

    void drive() {
        System.out.println(name + " drives a " + car + "!");
    }
}
```

Now `Driver` has everything `Criminal` has, PLUS a `car` field and a `drive()` method. The parent `Criminal` doesn't know about driving — that's the driver's own thing

---

Here's a full runnable example

```java
class Criminal {
    String name;

    Criminal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("Some random Vice City criminal");
    }
}

class Driver extends Criminal {
    Driver(String name) {
        super(name);
    }

    void speak() {
        System.out.println("I'm the driver " + name);
    }
}

class Gunman extends Criminal {
    Gunman(String name) {
        super(name);
    }

    void speak() {
        System.out.println("I'm the gunman " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Driver d = new Driver("Tommy");
        Gunman g = new Gunman("Lance");
        d.speak();
        g.speak();
    }
}
```

Output

```text
I'm the driver Tommy
I'm the gunman Lance
```

---

## Mission: Tommy's Crew

Tommy's crew has different roles, but they're all criminals. Each one introduces themselves their own way. Build the inheritance hierarchy.

Create a `Criminal` class with a `name` field, a constructor, and a `speak()` method that prints `"..."`. Then create two child classes:

1. `Driver` extends `Criminal` — overrides `speak()` to print `"I'm the driver "` + name
2. `Gunman` extends `Criminal` — overrides `speak()` to print `"I'm the gunman "` + name

In `main`, store the two names in variables `name1` and `name2` (start with `"Tommy"` and `"Lance"`). Create a `Driver` from `name1` and a `Gunman` from `name2`, then call `speak()` on both.

**Example**

```text
I'm the driver Tommy
I'm the gunman Lance
```
