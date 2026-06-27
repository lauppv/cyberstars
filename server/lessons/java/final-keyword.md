Sometimes you have a value that should **never change**. A crew member's max respect, the name of the city, the maximum wanted level — these are constants. In Java, the keyword `final` locks a variable so it can't be reassigned

---

## final Variables

```java
public class Main {
    public static void main(String[] args) {
        final int MAX_RESPECT = 100;
        final String CITY = "Vice City";

        System.out.println(CITY + " - Max respect: " + MAX_RESPECT);
    }
}
```

Output

```text
Vice City - Max respect: 100
```

Once a `final` variable is set, it's done. Try to change it and Java will refuse to compile:

```java
public class Main {
    public static void main(String[] args) {
        final int MAX_RESPECT = 100;
        MAX_RESPECT = 200;  // ERROR: cannot assign a value to final variable
    }
}
```

---

## Naming Convention: ALL_CAPS

By convention, `final` constants use **SCREAMING_SNAKE_CASE** — all uppercase letters with underscores between words:

```java
public class Main {
    public static void main(String[] args) {
        final int MAX_SPEED = 250;
        final String PLAYER_NAME = "Tommy Vercetti";
        final double COMMISSION = 0.15;
        final int LIVES_AT_START = 3;
    }
}
```

This makes constants instantly recognizable in your code. When you see `MAX_SPEED`, you know it's a constant without even looking at the declaration

---

## final Fields in Classes

You can use `final` on class fields too. A common pattern is `static final` for class-wide constants:

```java
class City {
    static final String NAME = "Vice City";
    static final int DISTRICTS = 6;
    static final int YEAR = 1986;
}

public class Main {
    public static void main(String[] args) {
        System.out.println("City: " + City.NAME);
        System.out.println("Districts: " + City.DISTRICTS);
        System.out.println("Year: " + City.YEAR);
    }
}
```

Output

```text
City: Vice City
Districts: 6
Year: 1986
```

`static final` means "one copy for the whole class, and it never changes." This is the Java equivalent of a true constant. You'll see this pattern in real Java code everywhere

---

## final Instance Fields

You can also make instance fields `final` — they get set once (in the constructor) and never change:

```java
class Player {
    final String name;
    int respect;

    Player(String name) {
        this.name = name;  // set once
        this.respect = 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player("Lance Vance");
        p.respect = 50;     // fine — respect isn't final
        // p.name = "Tommy";  // ERROR — name is final
        System.out.println(p.name + ": " + p.respect);
    }
}
```

Output

```text
Lance Vance: 50
```

This is great for fields that should be set at creation and never modified — like a crew member's name

---

## What final Does NOT Do

`final` stops **reassignment** of the variable, but it doesn't make objects immutable. If you have a `final` array, you can still change elements inside it:

```java
public class Main {
    public static void main(String[] args) {
        final int[] earnings = {10, 20, 30};
        earnings[0] = 99;   // allowed! We changed the content, not the variable
        // earnings = new int[]{1, 2, 3};  // ERROR! Can't reassign the variable
        System.out.println(earnings[0]);
    }
}
```

Output

```text
99
```

`final` means the variable always points to the **same object**. What happens inside that object is a different story

---

## Mission: Tommy's Constants

Some values in Tommy's empire must never change: the maximum respect a member can have and the name of the city. Define them as locked constants that no code can accidentally overwrite.

Create two `final` constants:

1. `MAX_RESPECT` set to `100`
2. `CITY` set to `"Vice City"`

Print both constants on separate lines.

**Example**

```text
100
Vice City
```
