Sometimes you have a value that should **never change**. A player's max health, the name of the game, the speed of light — these are constants. In Java, the keyword `final` locks a variable so it can't be reassigned

---

## final Variables

```java
public class Main {
    public static void main(String[] args) {
        final int MAX_HEALTH = 100;
        final String GAME_NAME = "CyberQuest";

        System.out.println(GAME_NAME + " - Max HP: " + MAX_HEALTH);
    }
}
```
Output
```text
CyberQuest - Max HP: 100
```

Once a `final` variable is set, it's done. Try to change it and Java will refuse to compile:

```java
public class Main {
    public static void main(String[] args) {
        final int MAX_HEALTH = 100;
        MAX_HEALTH = 200;  // ERROR: cannot assign a value to final variable
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
        final double GRAVITY = 9.81;
        final int LIVES_AT_START = 3;
    }
}
```

This makes constants instantly recognizable in your code. When you see `MAX_SPEED`, you know it's a constant without even looking at the declaration

---

## final Fields in Classes

You can use `final` on class fields too. A common pattern is `static final` for class-wide constants:

```java
class Game {
    static final int MAX_PLAYERS = 4;
    static final String VERSION = "1.0";
    static final int WINNING_SCORE = 1000;
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Game version: " + Game.VERSION);
        System.out.println("Max players: " + Game.MAX_PLAYERS);
        System.out.println("Win at: " + Game.WINNING_SCORE + " points");
    }
}
```
Output
```text
Game version: 1.0
Max players: 4
Win at: 1000 points
```

`static final` means "one copy for the whole class, and it never changes." This is the Java equivalent of a true constant. You'll see this pattern in real Java code everywhere

---

## final Instance Fields

You can also make instance fields `final` — they get set once (in the constructor) and never change:

```java
class Player {
    final String name;
    int score;

    Player(String name) {
        this.name = name;  // set once
        this.score = 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = new Player("Lance Vance");
        p.score = 50;     // fine — score isn't final
        // p.name = "Tommy";  // ERROR — name is final
        System.out.println(p.name + ": " + p.score);
    }
}
```
Output
```text
Lance Vance: 50
```

This is great for fields that should be set at creation and never modified — like a player's ID or username

---

## Python Comparison

Python doesn't have a real `final` keyword. By convention, constants are written in ALL_CAPS, but nothing actually prevents you from changing them:

```python
MAX_HEALTH = 100
MAX_HEALTH = 200  # Python won't stop you
```

Java actually enforces it. If you say `final`, you mean it, and the compiler holds you to it

---

## What final Does NOT Do

`final` stops **reassignment** of the variable, but it doesn't make objects immutable. If you have a `final` array, you can still change elements inside it:

```java
public class Main {
    public static void main(String[] args) {
        final int[] scores = {10, 20, 30};
        scores[0] = 99;   // allowed! We changed the content, not the variable
        // scores = new int[]{1, 2, 3};  // ERROR! Can't reassign the variable
        System.out.println(scores[0]);
    }
}
```
Output
```text
99
```

`final` means the variable always points to the **same object**. What happens inside that object is a different story

---

## Exercise

Create two `final` constants:
- `MAX_HEALTH` set to `100`
- `GAME_NAME` set to `"CyberQuest"`

Print both constants on separate lines, exactly like this:

Expected output:
```text
100
CyberQuest
```
