When you create a new object, Java calls a special method called a **constructor**. It's the code that runs **at birth** — setting up the object before anyone can use it

Think of it like this: when Tommy Vercetti arrives in Vice City, he starts with a name, a reputation, and maybe some cash. The constructor is what gives him those starting stats

---

## Your First Constructor

```java
class Player {
    String name;
    int score;

    Player(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player("Tommy", 100);
        System.out.println(p.name);
        System.out.println(p.score);
    }
}
```
Output
```text
Tommy
100
```

A few things to notice:

- The constructor has the **same name** as the class — `Player`
- It has **no return type**. Not `void`, not `int`, literally nothing before the name. That's how Java knows it's a constructor and not a regular method
- We use `new Player("Tommy", 100)` to create the object and call the constructor at the same time

---

## The `this` Keyword

You probably spotted `this.name = name` and wondered what's going on. Here's the deal:

- `name` (without `this`) refers to the **parameter** — the value passed in
- `this.name` refers to the **field** on the object itself

It's like saying "**this** object's name equals the name you gave me"

```java
Player(String name, int score) {
    this.name = name;     // object's name = parameter name
    this.score = score;   // object's score = parameter score
}
```

If the parameter had a different name, you wouldn't even need `this`:
```java
Player(String n, int s) {
    name = n;    // no confusion, so "this" is optional
    score = s;
}
```

But using `this` is considered good style — it makes your intent clear

---

## Default Constructor

If you write a class with **no constructor at all**, Java gives you a free one with no parameters:

```java
class Enemy {
    String type;
    int health;
}

public class Main {
    public static void main(String[] args) {
        Enemy e = new Enemy();   // works! Java made a default constructor
        System.out.println(e.type);    // null (Strings default to null)
        System.out.println(e.health);  // 0 (ints default to 0)
    }
}
```

But the moment you write **any** constructor yourself, Java stops giving you the free one:

```java
class Enemy {
    String type;
    int health;

    Enemy(String type) {
        this.type = type;
        this.health = 50;
    }
}

public class Main {
    public static void main(String[] args) {
        // Enemy e = new Enemy();  // ERROR! No zero-arg constructor anymore
        Enemy e = new Enemy("Goon");  // This works
        System.out.println(e.type);
        System.out.println(e.health);
    }
}
```
Output
```text
Goon
50
```

---

## Multiple Constructors

You can have more than one constructor — as long as they take different parameters. This is called **overloading**:

```java
class Weapon {
    String name;
    int damage;

    Weapon(String name, int damage) {
        this.name = name;
        this.damage = damage;
    }

    Weapon(String name) {
        this.name = name;
        this.damage = 10;  // default damage
    }
}

public class Main {
    public static void main(String[] args) {
        Weapon w1 = new Weapon("Katana", 75);
        Weapon w2 = new Weapon("Fists");
        System.out.println(w1.name + " deals " + w1.damage + " damage");
        System.out.println(w2.name + " deals " + w2.damage + " damage");
    }
}
```
Output
```text
Katana deals 75 damage
Fists deals 10 damage
```

---

## Python Comparison

In Python, the constructor is `__init__` and `self` is passed explicitly:

```python
class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score
```

In Java, the constructor name matches the class name, and `this` is available automatically — you don't put it in the parameter list

---

## Exercise

Create a `Player` class with two fields: `name` (String) and `score` (int). Write a constructor that takes both values and sets them using `this`.

Then in `main`, create two players:
- `"Tommy Vercetti"` with score `500`
- `"Lance Vance"` with score `300`

Print each player on their own line in this format: `Name has Score points`

Expected output:
```text
Tommy Vercetti has 500 points
Lance Vance has 300 points
```
