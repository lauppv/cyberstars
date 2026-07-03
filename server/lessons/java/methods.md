So far all our code has been crammed into **main**. A **method** is a piece of code we give a name to, write **once**, and reuse as many times as we want. In fact you've already used one dozens of times: **System.out.println** is a method

Let's write our own method

```java
public class Main {
    public static void greet(String name) {
        System.out.println("Hello, " + name);
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
Hello, Cortez
Hello, Tommy Vercetti
Hello, Lance Vance
```

We wrote the greeting logic **once**, but used it three times. Let's break down the line that declares the method

```text
public static void greet(String name)
```

Each part has a meaning — for now we explain only the essentials

- **public** — anyone can call this method
- **static** — for now, just write it. You'll understand it deeply when you study classes and objects
- **void** — the method does **not** return anything (it just prints something)
- **greet** — the name of the method
- **(String name)** — it takes a **parameter** called **name**, of type **String**. Notice the type **before** the parameter

We must put **public static void** at the start. Don't worry about why for now, just trust this pattern

---

A method can also **return** a value. In that case, instead of **void**, we write the type of the returned value

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

```text
public class Main {
    public static int add(int a, int b) {
        return "hello";   // error
    }
}
```

The method promises to return an **int**, but tries to give back a **String**. Java refuses to compile. This is one of Java's **strict** but **helpful** habits — many bugs are caught before the program even runs

---

A **void** method just does its job and exits. We can still use **return** alone (without a value) to exit early

```text
public class Main {
    public static void greet(String name) {
        if (name.length() == 0) {
            return;   // exit early, no greeting for empty names
        }
        System.out.println("Hello, " + name);
    }
}
```

---

## Mission: Splitting the Loot

After a successful heist, Tommy splits the loot equally among the crew. You want a method that does the math once and that you can reuse for every heist.

Write a method that takes the **total loot** and the **number of crew members** and **returns** each member's share (use integer division — whatever doesn't divide evenly is lost). Then, in **main**, call it for three heists and print a line of the form `loot / crew = share` for each.

Call it for:

- **10000** loot, **4** members
- **5000** loot, **3** members (does not divide evenly)
- **8000** loot, **1** member (all of it for him)

**Example**

```text
10000 / 4 = 2500
5000 / 3 = 1666
8000 / 1 = 8000
```
