This is the big one. Everything in Java revolves around **classes and objects**, and now you're going to build your own. If Java were GTA Vice City, this lesson is where you stop doing missions for other people and start building your own empire

---

So what's a **class**? Think of it as a **blueprint**. A blueprint for a car describes what a car **has** (color, speed, fuel) and what it can **do** (drive, brake, honk). But a blueprint isn't a car itself — you **build** cars from the blueprint

In Java terms

- A **class** is the blueprint
- An **object** is a specific thing built from that blueprint (also called an **instance**)

```java
class Car {
    String color;
    int speed;
}
```

This creates a **class** called **Car** with two **fields** (also called attributes or properties): a **color** (String) and a **speed** (int). No actual car exists yet — it's just the blueprint

---

To create an actual car, we use the **new** keyword

```java
class Car {
    String color;
    int speed;
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.color = "red";
        myCar.speed = 120;

        System.out.println("Color: " + myCar.color);
        System.out.println("Speed: " + myCar.speed);
    }
}
```

Output

```text
Color: red
Speed: 120
```

**new Car()** creates a new Car object. We store it in a variable called **myCar**. Then we use **dot notation** (myCar.color, myCar.speed) to set and read its fields

---

The power of classes is that you can create **multiple objects** from the same blueprint

```java
class Character {
    String name;
    int health;
    String weapon;
}

public class Main {
    public static void main(String[] args) {
        Character tommy = new Character();
        tommy.name = "Tommy Vercetti";
        tommy.health = 100;
        tommy.weapon = "M4";

        Character lance = new Character();
        lance.name = "Lance Vance";
        lance.health = 80;
        lance.weapon = "Pistol";

        System.out.println(tommy.name + " has " + tommy.health + " HP and carries a " + tommy.weapon);
        System.out.println(lance.name + " has " + lance.health + " HP and carries a " + lance.weapon);
    }
}
```

Output

```text
Tommy Vercetti has 100 HP and carries a M4
Lance Vance has 80 HP and carries a Pistol
```

**tommy** and **lance** are two different objects, both built from the same **Character** class. They each have their own **name**, **health**, and **weapon** values — changing one doesn't affect the other

---

When you create a new object, all fields start with **default values**

- Numbers (int, double) default to **0**
- Booleans default to **false**
- Objects (String, etc.) default to **null**

```java
class Player {
    String name;
    int score;
    boolean isOnline;
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player();
        System.out.println(p.name);       // null
        System.out.println(p.score);      // 0
        System.out.println(p.isOnline);   // false
    }
}
```

---

A few important details about the code structure. Notice that the **Car** class and the **Main** class are **separate classes in the same file**. In Java, only **one** class per file can be **public**, and it must match the filename. Our platform wraps your code in the Main class automatically for simple programs, but when you define your own classes, you need to write the full structure yourself

The class you define (like **Car** or **Character**) goes **outside** the Main class. The Main class contains **main()** where your program starts running

```java
class MyThing {
    // fields go here
}

public class Main {
    public static void main(String[] args) {
        // create objects and use them here
    }
}
```

---

Let's see why this is useful with a simple game inventory system

```java
class Weapon {
    String name;
    int damage;
    double weight;
}

public class Main {
    public static void main(String[] args) {
        Weapon w1 = new Weapon();
        w1.name = "Katana";
        w1.damage = 50;
        w1.weight = 3.5;

        Weapon w2 = new Weapon();
        w2.name = "Rocket Launcher";
        w2.damage = 200;
        w2.weight = 15.0;

        // compare them
        if (w1.damage > w2.damage) {
            System.out.println(w1.name + " deals more damage");
        } else {
            System.out.println(w2.name + " deals more damage");
        }
    }
}
```

Output **Rocket Launcher deals more damage**

Without classes, you'd need separate variables for every single field: **w1Name, w1Damage, w1Weight, w2Name, w2Damage, w2Weight**... It gets messy fast. Classes let you bundle related data together into one clean package

---

## Mission: Guard Dogs

Tommy is registering the guard dogs at his Vice City mansion. Each dog needs a name and an age on record before it goes on rotation.

Create a **class** that represents a guard dog, with a field for the **name** (String) and one for the **age** (int).

In `main`, build **two** dog objects with values of your choice, then print each dog on its own line in the format `Name is X years old`.

**Example** for a dog `Rex` aged `5` and one `Buddy` aged `3`

```text
Rex is 5 years old
Buddy is 3 years old
```

**Example** for a dog `Bruno` aged `7` and one `Ace` aged `2`

```text
Bruno is 7 years old
Ace is 2 years old
```
