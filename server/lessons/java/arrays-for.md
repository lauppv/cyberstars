We have an array of names. We want to greet each one. We **could** do

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

Repetitive. **Forbidden**, as we said in earlier lessons :)

The classic Java **for** loop goes hand in hand with arrays

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

Notice we used **i < names.length**, **not** **i <= names.length**. Why? Because indexes go from **0** to **length - 1**. For an array of **3** elements, indexes are **0, 1, 2**. **i = 3** is out of bounds. **i < length** stops at the right place

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

A classic pattern: **summing** numbers

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

Output **100**. Start with **total = 0**, walk through every price, add it to total. You will write this kind of loop **a lot** in your career. Read it line by line until it’s second nature :)

---

## Mission: Telemetry Report

The station just received a batch of sensor `scores`. Your job is to produce a quick telemetry report: list every reading, then show the **total** and the **average**.

1. Print each score on its own line
2. Print the **total** of all scores
3. Print the **average** as a decimal number (use a cast to `double`)

**Tip**: if you divide `total / scores.length` as ints, you get **79**, not **79.0**. Cast one side to `double`:

```text
double average = (double) total / scores.length;
```

**Input** (already set at the top of your code — change the values to test):

- `scores` — an `int[]` array of sensor readings

**Example**

With `scores = {80, 95, 60, 72, 88}`, your program should print

```text
80
95
60
72
88
395
79.0
```
