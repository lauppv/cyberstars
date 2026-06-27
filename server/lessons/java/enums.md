Imagine you're coding a Vice City mission system and you need to represent the current **weather**: sunny, rainy, foggy, or stormy. You _could_ use Strings like `"sunny"` and `"rainy"`, but someone could accidentally type `"suny"` and your code wouldn't catch the typo until runtime. This is where **enums** come in

An **enum** (short for enumeration) is a special type that represents a **fixed set of named values**. Once you define them, those are the only valid options

```java
enum Weather {
    SUNNY, RAINY, FOGGY, STORMY
}

public class Main {
    public static void main(String[] args) {
        Weather today = Weather.SUNNY;
        System.out.println("Today's weather: " + today);
    }
}
```

Output

```text
Today's weather: SUNNY
```

By convention, enum values are written in **UPPER_SNAKE_CASE**. You access them with the enum name, a dot, then the value: `Weather.SUNNY`

---

If you try to use a value that doesn't exist in the enum, the compiler stops everything before the program even runs

```java
enum Weather {
    SUNNY, RAINY, FOGGY, STORMY
}

public class Main {
    public static void main(String[] args) {
        Weather w = Weather.RAINY;   // works
        Weather w2 = Weather.SNOWY;  // ERROR -- SNOWY doesn't exist in Weather
    }
}
```

The compiler catches the mistake before the program even starts. That's one of Java's superpowers

---

Enums work perfectly with **switch** statements. Each case handles one possible value

```java
enum Weapon {
    PISTOL, SHOTGUN, AUTOMATIC, ROCKET_LAUNCHER
}

public class Main {
    public static void describeWeapon(Weapon w) {
        switch (w) {
            case PISTOL:
                System.out.println("A trusty sidearm. Low damage, high accuracy.");
                break;
            case SHOTGUN:
                System.out.println("Devastating up close. Tommy's favorite.");
                break;
            case AUTOMATIC:
                System.out.println("High fire rate. Good for intense missions.");
                break;
            case ROCKET_LAUNCHER:
                System.out.println("Overkill? Never heard of it.");
                break;
        }
    }

    public static void main(String[] args) {
        describeWeapon(Weapon.SHOTGUN);
        describeWeapon(Weapon.AUTOMATIC);
    }
}
```

Output

```text
Devastating up close. Tommy's favorite.
High fire rate. Good for intense missions.
```

Inside a switch you write just `PISTOL`, not `Weapon.PISTOL` — Java already knows you're switching on a `Weapon`, so it lets you skip the prefix

---

You can iterate through **all values** of an enum using the **values()** method

```java
enum Gang {
    VERCETTI, CUBANS, BIKERS, DIAZ
}

public class Main {
    public static void main(String[] args) {
        for (Gang g : Gang.values()) {
            System.out.println(g);
        }
    }
}
```

Output

```text
VERCETTI
CUBANS
BIKERS
DIAZ
```

`Gang.values()` returns an array of all enum constants in the order they were declared. Useful when you want to process every option

---

When should you use enums instead of Strings?

- **Enums** — when you have a **fixed, known** set of options: days of the week, seasons, difficulty levels, game states
- **Strings** — when the value is **free-form** or comes from the user: player names, messages, file paths

If you find yourself writing `if (status.equals("active") || status.equals("inactive") || ...)` — you probably want an enum

---

## Mission: Business Report

Tommy has several businesses in Vice City and wants a quick report. Each business can be in one of a few fixed states — making money, temporarily closed, under renovation, or destroyed by a rival gang. For example, Malibu Club is doing well and making money, Print Works is under renovation, Boatyard is temporarily closed, and Kaufman Cabs was destroyed by a rival gang

Define the possible states as a fixed set of values. Write a method that takes a state and prints what it means. In `main`, iterate through all states and call the method for each one

**Example**

```text
Active: making money every day
Closed: not generating income right now
Renovation: work in progress, opening soon
Destroyed: needs to be rebuilt from scratch
```
