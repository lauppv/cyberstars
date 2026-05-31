In Python we had **f-strings**, that nice **f"Hello, {name}"** trick. Java does **not** have f-strings (well, recent versions do, but in a different form). The classic Java way to combine text and variables is with the **+** operator

```java
public class Main {
    public static void main(String[] args) {
        String name = "Quincy";
        int age = 32;
        double height = 1.97;

        System.out.println("Hello. My name is " + name + ", I am " + age + " years old, and I am " + height + " tall");
    }
}
```

Output

```text
Hello. My name is Quincy, I am 32 years old, and I am 1.97 tall
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

Now **(2 + 3)** is computed first (giving **5**), then glued to the string. Remember this rule, you will hit it in real code :)

---

There is also **System.out.printf** for fancier formatting, but it’s a bit harder to read, so we’ll stick with **+** for now. **+** will be more than enough for the rest of these lessons

---

## Mission: Airlock Age Gate

The station’s airlock has a minimum-age restriction. A young recruit just tried to enter. Use string concatenation to display the rejection message.

The variables `username`, `userAge`, and `requiredAge` are already set on the right. Use **+** to build and print the message.

**Input** (already set at the top of your code — change the values to test):

- `username` — the recruit’s name (String)
- `userAge` — the recruit’s age (int)
- `requiredAge` — minimum age to enter (int)

**Example**

With `username = "Quincy"`, `userAge = 16`, and `requiredAge = 18`, your program should print

```text
Hello, Quincy! I’m sorry but the minimum age is 18. You are 16 years old
```
