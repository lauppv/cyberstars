In Python we called them **functions**. In Java, they are usually called **methods**. The idea is the same: a piece of code we write **once** and reuse many times

```java
public class Main {
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greet("Cortez");
        greet("Tommy Vercetti");
        greet("Lance Vance");
    }
}
```

Output

```text
Hello, Cortez!
Hello, Tommy Vercetti!
Hello, Lance Vance!
```

Let’s break this down. The line

```java
public class Main {
    public static void greet(String name)
}
```

declares a method named **greet**. Each part has a meaning, and we’ll explain only the essentials for now

- **public** — anyone can call this method
- **static** — for now, just write it. You’ll understand it deeply when you study classes and objects
- **void** — the method does **NOT** return anything (it just prints)
- **greet** — the name of the method
- **(String name)** — it takes a **parameter** called **name**, of type **String**. Notice the type **before** the parameter, not after

We must put **public static void** at the start. Don’t worry about why for now, just **trust the boilerplate** :)

---

A method can also **return** a value. In that case, instead of **void**, we write the return type

```java
public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(2, 3);
        System.out.println(result);
    }
}
```

Output **5**

The method **add** takes two ints and returns an int. Inside, we use **return** to give back the value. As soon as Java hits **return**, the method **exits immediately** — anything written after **return** is dead code

We can also use the result directly inside another expression

```java
public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(2, 3) * 10);
    }
}
```

Output **50**. Java first computes **add(2, 3) = 5**, then **5 \* 10 = 50**, then prints

---

The return type **must match** what we actually return

```java
public class Main {
    public static int add(int a, int b) {
        return "hello";   // ERROR
    }
}
```

The method promises to return an **int**, but tries to give back a **String**. Java refuses to compile. This is one of Java’s **strict** but **helpful** habits — many bugs are caught before the program even runs :)

---

A method without **return**, declared as **void**, just does its job and exits. We can still use **return** alone (without a value) to exit early

```java
public class Main {
    public static void greet(String name) {
        if (name.length() == 0) {
            return;   // exit early, no greeting for empty names
        }
        System.out.println("Hello, " + name + "!");
    }
}
```

---

## Mission: Ship Computer

The station’s on-board computer needs a **calculator** method. It already handles addition, but the crew also needs **subtraction** (`-`), **multiplication** (`*`), and **division** (`/`).

Complete the `calculator` method on the right so it handles all four operators. For any unrecognised operator, it should print `Invalid operator`.

The method takes three parameters: `number1`, `number2`, and `operator`. It should print a line like `14 + 12 = 26`.

A small **trap**: in Java, you compare strings with `.equals(...)`, **NOT** with `==`. So write `operator.equals("+")`, not `operator == "+"`.

**Input** (the calls are already in `main` — change the values to test):

- `number1` — the first operand
- `number2` — the second operand
- `operator` — one of `"+"`, `"-"`, `"*"`, `"/"`

**Example**

With the starter calls, your program should print

```text
14 + 12 = 26
10 - 3 = 7
5 * 4 = 20
10 / 2 = 5
Invalid operator
```
