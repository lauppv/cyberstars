Here's something Java can do that Python can't (at least not natively): you can have **multiple methods with the same name**, as long as they take **different parameters**. This is called **method overloading**

Imagine Phil Cassidy's gun shop. You walk in and say "I want a weapon." Phil's response depends on **what info you give him**:

- Just a name? He grabs it off the shelf
- A name and a quantity? He grabs that many
- A name, quantity, and budget? He checks the price too

Same request ("I want a weapon"), different details. That's overloading

```java
public class Main {
    public static void weapon(String name) {
        System.out.println("Weapon: " + name);
    }

    public static void weapon(String name, int count) {
        System.out.println("Weapon: " + name + " (x" + count + ")");
    }

    public static void main(String[] args) {
        weapon("Shotgun");
        weapon("Pistol", 3);
    }
}
```
Output
```text
Weapon: Shotgun
Weapon: Pistol (x3)
```

Java looks at **how many arguments** you pass and **what types** they are, then picks the right version of the method. This happens at compile time — Java figures it out before the program even runs

---

The key rule: overloaded methods must differ in their **parameter list**. That means either a different **number** of parameters, or different **types**

```java
public class Main {
    public static void info(String text) {
        System.out.println("Text: " + text);
    }

    public static void info(int number) {
        System.out.println("Number: " + number);
    }

    public static void info(String text, int number) {
        System.out.println("Text: " + text + ", Number: " + number);
    }

    public static void main(String[] args) {
        info("Tommy");
        info(42);
        info("Lance", 100);
    }
}
```
Output
```text
Text: Tommy
Number: 42
Text: Lance, Number: 100
```

Three methods, all named **info**, but Java knows which one to call based on what you pass in

---

What does **NOT** count as overloading? Changing only the **return type**

```java
// This WON'T compile — same parameters, different return type
public static int calculate(int a) { return a * 2; }
public static double calculate(int a) { return a * 2.0; }
```

Java says: "If someone calls **calculate(5)**, which one do I pick?" It can't tell just from the return type, so this is **not allowed**

---

Overloading is super common in Java's built-in libraries. You've already used it without knowing — **System.out.println** is overloaded! It can take a String, an int, a double, a boolean... all different versions of the same method

```java
System.out.println("hello");   // println(String)
System.out.println(42);        // println(int)
System.out.println(3.14);      // println(double)
System.out.println(true);      // println(boolean)
```

---

In Python, if you wanted something similar, you'd use default arguments or **\*args**. Java doesn't have **\*args**, so overloading is the Java way to handle "same action, different inputs"

---

Create three overloaded methods called **describe**

1. **describe(String item)** — prints **Item: X** (where X is the item)
2. **describe(String item, int quantity)** — prints **Item: X (x5)** (where 5 is the quantity)
3. **describe(String item, int quantity, double price)** — prints **Item: X (x5) - $P** (where P is the price)

Then call all three from main

```java
describe("Sword");
describe("Shield", 5);
describe("Potion", 3, 9.99);
```

Expected output
```text
Item: Sword
Item: Shield (x5)
Item: Potion (x3) - $9.99
```
