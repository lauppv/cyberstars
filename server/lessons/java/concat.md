We already have **+**, **-**, **\***, **/**, and **%**. But **+** has a second talent: besides adding numbers, it can **glue text together**. This is the classic Java way to combine text and variables

```java
public class Main {
    public static void main(String[] args) {
        String name = "Quincy";
        int age = 32;
        double height = 1.97;

        System.out.println("Hello. My name is " + name + ", I am " + age + " years old and " + height + " m tall");
    }
}
```

Output

```text
Hello. My name is Quincy, I am 32 years old and 1.97 m tall
```

What is happening here? When we put a **String** and another value together with **+**, Java **converts everything to text** and glues them. This is called **string concatenation**

Watch the spaces carefully

```text
"Hello. My name is " + name
```

We have a space **before the closing quote**, otherwise we’d get **Hello. My name isQuincy** all stuck together. This is something almost everyone gets wrong at first. **Always check your spaces**

---

A small but very important subtlety

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Result: " + 2 + 3);
    }
}
```

What do you think this prints? **Result: 5**?

It prints **Result: 23**

Why? Java reads from **left to right**. It starts with **"Result: "** (a String), then sees **+ 2**: a String + an int = String, so it becomes **"Result: 2"**. Then **+ 3** → **"Result: 23"**

If we want **5**, we use **parentheses** to force the math first

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Result: " + (2 + 3));
    }
}
```

Output

```text
Result: 5
```

Now **(2 + 3)** is computed first (giving **5**), then glued to the string. Remember this rule, you will hit it in real code

---

**+** is enough for simple cases, but when you have a lot of text to combine it gets hard to read, full of quotes and **+** signs. Java has a cleaner alternative: **String.format()**

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        String message = String.format("Hello, %s!", name);
        System.out.println(message);
    }
}
```

Output

```text
Hello, Tommy Vercetti!
```

**%s** is a **placeholder** — it means "put a String here". When Java runs `String.format(...)`, it replaces `%s` with the value of `name`. Think of it as a template where you fill in the blanks

---

There are different placeholders for different types

- **%s** — String (or anything else — Java converts it to text)
- **%d** — whole number (int)
- **%f** — number with a decimal point (double)

```java
public class Main {
    public static void main(String[] args) {
        String player = "Lance Vance";
        int kills = 47;
        double accuracy = 82.5;

        System.out.println(String.format("Player: %s | Kills: %d | Accuracy: %f", player, kills, accuracy));
    }
}
```

Output

```text
Player: Lance Vance | Kills: 47 | Accuracy: 82.500000
```

Wait, that’s a lot of decimals! By default, **%f** prints 6 decimals. To control that, use **%.Nf**, where N is the number of decimals you want

---

**%.2f** means "print 2 decimals". This is the one you’ll use most often

```java
public class Main {
    public static void main(String[] args) {
        double price = 4.5;
        System.out.println(String.format("Price: $%.2f", price));
    }
}
```

Output

```text
Price: $4.50
```

---

Java also has **printf()**, which formats AND prints in a single step, so you don’t need a separate `String.format()` plus `System.out.println()`

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy";
        int score = 1500;
        System.out.printf("Player: %s | Score: %d%n", name, score);
    }
}
```

Notice the **%n** at the end — that is the newline character for printf. Without it, the next print would continue on the same line

Use whichever you prefer — `String.format()` is great when you want to store the text in a variable, and `printf()` is great when you just want to print it right away

---

## Mission: Scoreboard

The station’s arcade just finished a tournament. Print the winner’s stats on a single line.

Create three variables: the player’s name (String), the total score (int), and the performance rating (double). Then print a line of the form `Player: <name> | Score: <score> | Rating: <rating>`. You can use **+** or **String.format()** — whichever you prefer.

**Example**

With the name `Tommy Vercetti`, the score `1500`, and the rating `4.75`, your program should print

```text
Player: Tommy Vercetti | Score: 1500 | Rating: 4.75
```
