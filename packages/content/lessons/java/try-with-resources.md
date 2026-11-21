Some objects hold something open: a file, a connection, a door. When you are done, you must close them. If an exception jumps out halfway, the close line never runs and the door stays open

You already know one fix: `finally` runs no matter what. But Java has a shorter and safer way, **try-with-resources**

```java
class Door implements AutoCloseable {
    Door() {
        System.out.println("Door opens");
    }

    public void close() {
        System.out.println("Door locks");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Door d = new Door()) {
            System.out.println("Counting the money");
        }
        System.out.println("Gone");
    }
}
```

Output

```text
Door opens
Counting the money
Door locks
Gone
```

You make the object inside the brackets after `try`. When the block ends, Java calls its `close()` for you

---

It works for any class that implements **AutoCloseable**. That interface has a single method to write: `close()`. Files, Scanners and many other Java classes implement it already

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner("7500 dunno 230")) {
            System.out.println(sc.next());
            System.out.println(sc.next());
        }
    }
}
```

Output

```text
7500
dunno
```

Here the Scanner reads from a String instead of the keyboard, and gets closed at the end

---

The best part: `close()` runs even when an exception flies out of the block. It runs first, before the `catch`

```java
class Door implements AutoCloseable {
    Door() {
        System.out.println("Door opens");
    }

    public void close() {
        System.out.println("Door locks");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Door d = new Door()) {
            System.out.println("Counting the money");
            throw new IllegalStateException("Sirens!");
        } catch (IllegalStateException e) {
            System.out.println("Run: " + e.getMessage());
        }
    }
}
```

Output

```text
Door opens
Counting the money
Door locks
Run: Sirens!
```

Even in a hurry, the door gets locked

---

You can open several resources in one `try`, separated by `;`. Java closes them in the opposite order: the last one opened is the first one closed

```text
try (Door front = new Door(); Door back = new Door()) {
    ...
}
```

---

## Mission: The Safehouse

Tommy keeps a safehouse for his crew. Each visitor gets the door opened, goes in, and the door must be locked again after them, whatever happens

Make a class `Door` that implements `AutoCloseable`. Its constructor takes the visitor's name and prints `Door opens for name`. Its `close()` prints `Door locks`

The visitors are in a `String[] visitors` array. For each one, open a `Door` with try-with-resources. Inside, if the visitor is `Cops`, throw an `IllegalStateException` with the message `Cops at the door`. Otherwise print `name is inside`. Catch the exception and print `Alarm: ` and the message. At the end, print `Safe visits: ` and how many visitors got in

**Example**

```text
Door opens for Lance
Lance is inside
Door locks
Door opens for Cops
Door locks
Alarm: Cops at the door
Door opens for Phil
Phil is inside
Door locks
Safe visits: 2
```

**Example**

```text
Safe visits: 0
```
