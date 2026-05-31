Java comes with a built-in **Math** class that's loaded with useful methods for numbers. The best part? You don't need to import anything — it's always available, just like **System.out.println**

---

**Math.max(a, b)** — returns the larger of two numbers

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.max(42, 17));    // 42
        System.out.println(Math.max(-5, -20));   // -5
    }
}
```

Like Phil Cassidy comparing his gun collection: "Which one's bigger?" Math.max tells you

---

**Math.min(a, b)** — returns the smaller of two numbers

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.min(42, 17));    // 17
        System.out.println(Math.min(100, 200));  // 100
    }
}
```

---

**Math.abs(n)** — returns the absolute value (removes the negative sign)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.abs(-99));   // 99
        System.out.println(Math.abs(50));    // 50
        System.out.println(Math.abs(0));     // 0
    }
}
```

Tommy Vercetti lost $99? The absolute value of that loss is 99. Always positive (or zero)

---

**Math.pow(base, exponent)** — raises a number to a power. Returns a **double**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.pow(2, 10));   // 1024.0
        System.out.println(Math.pow(3, 3));    // 27.0
        System.out.println(Math.pow(5, 0));    // 1.0
    }
}
```

Notice it returns **1024.0**, not **1024**. That's because Math.pow always returns a **double**. If you want an int, cast it

```java
public class Main {
    public static void main(String[] args) {
        int result = (int) Math.pow(2, 10);
        System.out.println(result);   // 1024
    }
}
```

The **(int)** in front is a **cast** — it converts the double to an int by chopping off the decimal part. We used this trick in the lesson exercise below

---

**Math.sqrt(n)** — returns the square root. Also returns a double

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.sqrt(144));   // 12.0
        System.out.println(Math.sqrt(2));     // 1.4142135623730951
    }
}
```

---

**Math.random()** — returns a random double between 0.0 (inclusive) and 1.0 (exclusive)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.random());   // something like 0.7364281...
        System.out.println(Math.random());   // something different each time
    }
}
```

To get a random int in a range, say 1 to 6 (like a dice roll)

```java
public class Main {
    public static void main(String[] args) {
        int dice = (int)(Math.random() * 6) + 1;
        System.out.println("You rolled: " + dice);
    }
}
```

How it works: **Math.random() \* 6** gives a double from 0.0 to 5.999..., **(int)** chops it to 0-5, then **+ 1** shifts it to 1-6. Cortez would approve of the math

---

You can also **combine** these methods. Want the bigger of two absolute values?

```java
public class Main {
    public static void main(String[] args) {
        int a = -15;
        int b = 8;
        int result = Math.max(Math.abs(a), Math.abs(b));
        System.out.println(result);   // 15
    }
}
```

Java evaluates from the inside out: first **Math.abs(-15) = 15** and **Math.abs(8) = 8**, then **Math.max(15, 8) = 15**

---

In Python, some of these are built-in functions (**abs**, **max**, **min**, **pow**) and some come from the **math** module (**math.sqrt**). In Java, they're all neatly organized under the **Math** class

| Python              | Java           |
| ------------------- | -------------- |
| max(a, b)           | Math.max(a, b) |
| min(a, b)           | Math.min(a, b) |
| abs(n)              | Math.abs(n)    |
| pow(a, b) or a\*\*b | Math.pow(a, b) |
| math.sqrt(n)        | Math.sqrt(n)   |
| random.random()     | Math.random()  |

---

## Mission: Navigation Computer

The navigation computer needs four quick calculations before the next jump. Print each result on a **separate line**:

1. The larger of `42` and `17` — use `Math.max`
2. The smaller of `42` and `17` — use `Math.min`
3. The absolute value of `-99` — use `Math.abs`
4. `2` raised to the power `10` as an integer — use `(int) Math.pow`

**Example**

Your program should print

```text
42
17
99
1024
```
