In the methods lesson, we saw that a method can **return** a value instead of just printing. Let's dive deeper into **return values** — they're one of the most powerful tools in your Java toolbox

Think of a method with a return value like a **vending machine**. You put something in (parameters), the machine does its thing, and it **gives you something back** (the return value). A **void** method is like a loudspeaker — it does something (plays sound) but doesn't hand you anything

```java
public class Main {
    public static int square(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        int result = square(5);
        System.out.println(result);   // 25
    }
}
```

Output **25**

The return type **int** before the method name tells Java: "this method will give back an int." Inside the method, **return** sends that value back to whoever called it

---

We can return **any type** — not just int. Here are a few examples

```java
public class Main {
    public static String greet(String name) {
        return "Welcome to Vice City, " + name + "!";
    }

    public static double half(double n) {
        return n / 2.0;
    }

    public static boolean isVIP(String name) {
        return name.equals("Tommy Vercetti");
    }

    public static void main(String[] args) {
        System.out.println(greet("Lance Vance"));
        System.out.println(half(100));
        System.out.println(isVIP("Tommy Vercetti"));
        System.out.println(isVIP("Phil Cassidy"));
    }
}
```

Output

```text
Welcome to Vice City, Lance Vance!
50.0
true
false
```

Each method declares its return type right before its name: **String**, **double**, **boolean**. The type must match what you actually return — Java won't let you return a String from a method that promises an int

---

The cool thing about return values is that you can **use them in expressions**, just like any other value

```java
public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        // Use the return value directly in math
        int total = add(10, 20) + add(5, 5);
        System.out.println(total);   // 40

        // Use it directly in println
        System.out.println(add(100, 200));   // 300

        // Use it in a condition
        if (add(2, 3) > 4) {
            System.out.println("Yep, 5 > 4");
        }
    }
}
```

Output

```text
40
300
Yep, 5 > 4
```

You can think of a method call like **add(10, 20)** as being **replaced** by its return value. So **add(10, 20) + add(5, 5)** becomes **30 + 10** which is **40**

---

A common mistake: trying to **return** inside a **void** method, or forgetting to **return** in a non-void method

```java
public class Main {
    // ERROR: void method can't return a value
    public static void doStuff() {
        return 42;   // won't compile
    }

    // ERROR: method promises int but has no return
    public static int getNumber() {
        int x = 42;
        // forgot to return x!
    }
}
```

Java catches both of these at compile time. Thanks, Java :)

---

**void vs return** — when do you use which?

- Use **void** when the method just **does** something (prints, modifies data, etc.)
- Use a **return type** when the method **computes** something and you need the result

Tommy Vercetti doesn't just run missions — he **brings back the money**. That's a return value. If he just causes chaos with no reward, that's void

---

## Mission: Engine Thrust

The station's thruster power is calculated as `base` raised to the power of `exponent`. Write a method called `power` that takes two `int` parameters (`base` and `exponent`) and **returns** the result.

Compute it with a loop: start with `result = 1`, then multiply by `base` a total of `exponent` times. Anything raised to the power of **0** is **1** — your loop naturally handles this if it runs 0 times.

The calls are already in `main` on the right.

**Input** (change the calls in `main` to test):

- `base` — the base number
- `exponent` — how many times to multiply

**Example**

With the starter calls, your program should print

```text
8
25
1
```
