Imagine you're coding a Vice City mission system and you need to represent the current **weather**: sunny, rainy, foggy, or stormy. You *could* use Strings like `"sunny"` and `"rainy"`, but then someone could accidentally type `"suny"` and your code wouldn't catch the typo until runtime. Enter **enums**

An **enum** (short for enumeration) is a special type that represents a **fixed set of named values**. Once you define them, those are the ONLY valid options

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

By convention, enum values are written in **ALL_CAPS**. You access them with the enum name, a dot, then the value: `Weather.SUNNY`

---

Python doesn't have enums built into the language the same way (there's an `enum` module, but most beginners never use it). In Python, you'd probably just use strings or constants. Java's approach is **safer** because the compiler checks that you only use valid values

```java
public class Main {
    public static void main(String[] args) {
        Weather w = Weather.RAINY;    // works
        Weather w = Weather.SNOWY;    // ERROR — SNOWY doesn't exist in Weather
    }
}
```

The compiler catches your mistake before the program even runs. This is one of those Java superpowers that saves you from sneaky bugs

---

Enums work beautifully with **switch** statements. Each case handles one possible value

```java
enum Weapon {
    PISTOL, SHOTGUN, ROCKET_LAUNCHER, KATANA
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
            case ROCKET_LAUNCHER:
                System.out.println("Overkill? Never heard of it.");
                break;
            case KATANA:
                System.out.println("Silent and deadly. Samurai style.");
                break;
        }
    }

    public static void main(String[] args) {
        describeWeapon(Weapon.SHOTGUN);
        describeWeapon(Weapon.KATANA);
    }
}
```
Output
```text
Devastating up close. Tommy's favorite.
Silent and deadly. Samurai style.
```

Notice: inside the switch, you write just `PISTOL`, not `Weapon.PISTOL`. Java already knows you're switching on a `Weapon`, so it lets you skip the prefix

---

You can loop through **all values** of an enum using the **values()** method

```java
enum Gang {
    VERCETTI, CUBANS, HAITIANS, BIKERS
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
HAITIANS
BIKERS
```

`Gang.values()` returns an array of all the enum constants in the order they were declared. Super useful when you want to process every option

---

When should you use enums vs Strings?

- **Use enums** when you have a **fixed, known set** of options: days of the week, seasons, difficulty levels, game states (MENU, PLAYING, PAUSED, GAME_OVER)
- **Use Strings** when the value is **free-form** or user-provided: player names, messages, file paths

If you find yourself writing `if (status.equals("active") || status.equals("inactive") || ...)` — that's a sign you probably want an enum

---

Your turn! Create an enum called **Season** with four values: `SPRING`, `SUMMER`, `AUTUMN`, `WINTER`. Write a static method `describeSeason(Season s)` that prints a description for each:

- SPRING: `"Spring: flowers bloom"`
- SUMMER: `"Summer: time for the beach"`
- AUTUMN: `"Autumn: leaves are falling"`
- WINTER: `"Winter: stay inside and code"`

Then in main, loop through **all** seasons using `Season.values()` and call `describeSeason` for each one