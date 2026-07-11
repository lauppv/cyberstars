So far, every variable held **one** thing. But what if we want to store **all** the GTA Vice City characters? Writing **name1**, **name2**, **name3**... is ugly. We need an **array**

An **array** is a collection of values of the **same type**, stored in a single variable

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy" };

        System.out.println(names[0]);
        System.out.println(names[1]);
        System.out.println(names[2]);
    }
}
```

Output

```text
Tommy Vercetti
Lance Vance
Cortez
```

Two new things

- The type is **String[]** (notice the **[]**) — "an array of Strings"
- We use **{ }** to list the values, separated by commas

**Counting starts from 0**. **names[0]** is the first element, **names[1]** the second, and so on

---

Java arrays have a **fixed size**. Once you create them, you can’t add or remove elements. (For dynamic collections, Java has **ArrayList**, but we’ll keep arrays for now)

How many elements does the array have? Use **.length**

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        System.out.println(names.length);   // 3
    }
}
```

**Notice**: **names.length** has **no parentheses**, unlike **String.length()**. Yes, this is annoyingly inconsistent — arrays use a **field** called **length**, while Strings have a **method** called **length()**

---

We can also create an array with a fixed size, then fill it later

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = new int[5];   // an array of 5 ints, all zero by default
        scores[0] = 80;
        scores[1] = 95;
        scores[2] = 60;
        scores[3] = 72;
        scores[4] = 88;
        System.out.println(scores[2]);   // 60
    }
}
```

**new int[5]** creates an array with **5** slots. By default they are filled with **0** for numbers, **null** for objects (like Strings), and **false** for booleans

---

We can **change** a value at any index

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        names[1] = "Lance Vance Dance";
        System.out.println(names[1]);   // Lance Vance Dance
    }
}
```

---

What happens if we ask for an index that doesn’t exist?

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        System.out.println(names[10]);
    }
}
```

Run it. Java throws an **ArrayIndexOutOfBoundsException** and crashes. Always read the error message — it tells you exactly which index you asked for and what the limit was

---

Now the most useful part: walking through **all** the elements. Let’s print a greeting for each name. We **could** write one line per name

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        System.out.println("Hello, " + names[0] + "!");
        System.out.println("Hello, " + names[1] + "!");
        System.out.println("Hello, " + names[2] + "!");
    }
}
```

Repetitive, and it breaks the moment the array has more elements. The **for** loop goes hand in hand with arrays

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };

        for (int i = 0; i < names.length; i++) {
            System.out.println("Hello, " + names[i] + "!");
        }
    }
}
```

Notice we used **i < names.length**, **not** **i <= names.length**. Why? Because indexes go from **0** to **length - 1**. For an array of **3** elements, indexes are **0, 1, 2**. **i = 3** is out of bounds. **i < length** stops at exactly the right place

---

Java has a shorter form when we don’t need the index — the **enhanced for loop** (also called **for-each**)

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };

        for (String name : names) {
            System.out.println("Hello, " + name + "!");
        }
    }
}
```

Read it as: "for each **name** in **names**, do this". Cleaner when we just want the value

The shape is **for (Type variable : array) { ... }**. The **:** in the middle is essential

When do you choose one over the other?

- Use the **classic for** when you need the **index** (e.g., for printing position numbers)
- Use the **enhanced for** when you only need the **value**

Both are common — Java code uses both depending on the situation

---

A classic pattern: **summing** the numbers in an array

```java
public class Main {
    public static void main(String[] args) {
        int[] prices = { 10, 20, 30, 40 };
        int total = 0;
        for (int price : prices) {
            total = total + price;
        }
        System.out.println(total);
    }
}
```

Output **100**. Start with **total = 0**, walk through every price, add it to total. You will write this kind of loop **a lot** in your career. Read it line by line until it’s second nature

---

## Mission: Empire Report

Every one of Tommy’s Vice City businesses reported its takings for today. Your job is to produce a quick report: list every amount, then show the **total** and the **average**.

Put the takings in an `int` array named `takings`. Then:

1. Print each amount on its own line
2. Print the **total** of all amounts
3. Print the **average** as a decimal number (use a cast to `double`)

**Tip**: if you divide `total / number_of_amounts` as ints, you get a truncated whole number, not a decimal. Cast one side to `double` to keep the decimals:

```text
double average = (double) total / takings.length;
```

**Example**

For the takings `{ 1200, 3400, 800, 2600 }`, your program should print

```text
1200
3400
800
2600
8000
2000.0
```

**Example** for a single business `{ 5000 }` (the average is that very amount)

```text
5000
5000
5000.0
```

**Example** when the average is **not** a round number `{ 125, 200 }`

```text
125
200
325
162.5
```
