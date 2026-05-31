In Python, if you wanted a `Dog` class that's basically an `Animal` with extras, you'd write `class Dog(Animal):`. Java does the same thing but uses the keyword **extends**

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    void speak() {
        System.out.println("Woof! I'm " + name);
    }
}
```

The `Dog` class **inherits** everything from `Animal` — its `name` field, its constructor logic, everything. Then it **overrides** the `speak()` method to do its own thing. This is **inheritance** — one of the biggest ideas in Java

---

Think of it like GTA Vice City. Tommy Vercetti is a **criminal** (the parent class). Lance Vance is also a criminal, but he's a _specific kind_ — a backstabbing criminal. He **extends** the base criminal class with his own special behavior (betrayal). He still has all the base criminal abilities, plus his own twist

---

The **super** keyword is how a child talks to its parent. When `Dog` calls `super(name)`, it's saying "hey Animal, run YOUR constructor with this name." The parent constructor sets `this.name = name`, and now the dog has a name

You **must** call `super(...)` in the child constructor if the parent doesn't have a no-argument constructor. Java won't let you skip it — the parent needs to be set up before the child can add its own stuff

```java
class Animal {
    String name;
    int legs;

    Animal(String name, int legs) {
        this.name = name;
        this.legs = legs;
    }
}

class Spider extends Animal {
    Spider(String name) {
        super(name, 8);  // spiders always have 8 legs
    }
}
```

---

A child class can also **add** new fields and methods that the parent doesn't have

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    String breed;

    Dog(String name, String breed) {
        super(name);
        this.breed = breed;
    }

    void speak() {
        System.out.println("Woof! I'm " + name);
    }

    void fetch() {
        System.out.println(name + " fetches the ball!");
    }
}
```

Now `Dog` has everything `Animal` has, PLUS a `breed` field and a `fetch()` method. The parent `Animal` doesn't know about fetch — that's the dog's own thing

---

Here's a full runnable example

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void speak() {
        System.out.println("Some generic animal sound");
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    void speak() {
        System.out.println("Woof! My name is " + name);
    }
}

class Cat extends Animal {
    Cat(String name) {
        super(name);
    }

    void speak() {
        System.out.println("Meow! My name is " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Rex");
        Cat c = new Cat("Whiskers");
        d.speak();
        c.speak();
    }
}
```

Output

```text
Woof! My name is Rex
Meow! My name is Whiskers
```

---

## Mission: Crew Companion Registry

The station allows crew members to bring animal companions aboard. Every companion has a name and can vocalize, but dogs and cats do it differently. You need to build the inheritance hierarchy for the registry.

Create an `Animal` class with a `name` field, a constructor, and a `speak()` method that prints `"..."`. Then create two child classes:

1. `Dog` extends `Animal` — overrides `speak()` to print `"Woof! My name is "` + name
2. `Cat` extends `Animal` — overrides `speak()` to print `"Meow! My name is "` + name

In `main`, create a Dog named `"Tommy"` and a Cat named `"Lance"`, and call `speak()` on both.

**Example**

Your program should print

```text
Woof! My name is Tommy
Meow! My name is Lance
```
