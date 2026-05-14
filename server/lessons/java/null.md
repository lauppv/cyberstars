In Python, you have `None` — the value that means "nothing." Java has its own version: `null`. It means a reference variable doesn't point to any object. And if you're not careful, it'll crash your program with one of the most famous errors in all of programming

---

## What Is null?

When you declare a reference variable without giving it a value, it defaults to `null`:

```java
public class Main {
    public static void main(String[] args) {
        String name = null;
        System.out.println(name);
    }
}
```
Output
```text
null
```

`null` isn't a string, it isn't zero, it isn't an empty string. It's literally **nothing** — the variable exists but points nowhere

---

## The Dreaded NullPointerException

Try to call a method on `null` and Java panics:

```java
public class Main {
    public static void main(String[] args) {
        String name = null;
        System.out.println(name.length());  // CRASH!
    }
}
```
Output
```text
Exception in thread "main" java.lang.NullPointerException
```

This is a **NullPointerException** (NPE for short). It's the most common runtime error in Java. Tommy Vercetti has crashed more Java programs than he has cars in Vice City

The problem: you asked for the `.length()` of nothing. There's no string to measure, so Java throws an exception

---

## Checking for null

The fix is simple — check before you use:

```java
public class Main {
    public static void main(String[] args) {
        String name = null;

        if (name != null) {
            System.out.println("Name: " + name);
        } else {
            System.out.println("No name set!");
        }
    }
}
```
Output
```text
No name set!
```

Use `!= null` to check if something exists, and `== null` to check if it doesn't. This is a habit you'll develop over time — always think "could this be null?"

---

## null vs Empty String vs Zero

These are three completely different things:

```java
public class Main {
    public static void main(String[] args) {
        String a = null;    // no object at all
        String b = "";      // an object — an empty string
        String c = "hello"; // an object — a string with content

        System.out.println(a == null);     // true — it's null
        System.out.println(b == null);     // false — it's an empty string, not null
        System.out.println(b.length());    // 0 — empty but it exists
        System.out.println(c.length());    // 5
    }
}
```
Output
```text
true
false
0
5
```

Think of it this way: `null` means you don't even have a box. `""` means you have an empty box. `"hello"` means you have a box with stuff in it

---

## null with Objects

It's not just strings — any object reference can be null:

```java
class Player {
    String name;

    Player(String name) {
        this.name = name;
    }
}

public class Main {
    public static void main(String[] args) {
        Player p = null;
        // System.out.println(p.name);  // NullPointerException!

        if (p != null) {
            System.out.println(p.name);
        } else {
            System.out.println("No player!");
        }
    }
}
```
Output
```text
No player!
```

---

## Primitives Cannot Be null

Here's an important distinction: **primitive types** (`int`, `double`, `boolean`, `char`) **cannot** be null. Only reference types (objects, strings, arrays) can:

```java
int x = 0;           // valid — x is 0
// int y = null;      // ERROR! Primitives can't be null
String s = null;      // valid — s is null
int[] arr = null;     // valid — arrays are objects
```

If you need an integer that can be "nothing," you'll use **wrapper classes** (like `Integer`) — but that's the next lesson

---

## A Safe Greeting Method

A common pattern is writing methods that handle null gracefully:

```java
public class Main {
    static String greet(String name) {
        if (name != null) {
            return "Hello, " + name + "!";
        } else {
            return "Hello, stranger!";
        }
    }

    public static void main(String[] args) {
        System.out.println(greet("Tommy Vercetti"));
        System.out.println(greet(null));
        System.out.println(greet("Phil Cassidy"));
    }
}
```
Output
```text
Hello, Tommy Vercetti!
Hello, stranger!
Hello, Phil Cassidy!
```

---

## Python Comparison

Python's `None` is the same concept:

```python
name = None
if name is not None:
    print(f"Hello, {name}!")
```

The difference: Python gives you an `AttributeError`, Java gives you a `NullPointerException`. Both mean the same thing — you tried to use something that doesn't exist

---

## Exercise

Write a static method called `greet` that takes a `String name` parameter:
- If `name` is **not null**, return `"Hello, Name!"`
- If `name` **is null**, return `"Hello, stranger!"`

In `main`, call the method twice and print the results:
1. `greet("Tommy")` 
2. `greet(null)`

Expected output:
```text
Hello, Tommy!
Hello, stranger!
```
