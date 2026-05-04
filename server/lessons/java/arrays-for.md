We have an array of names. We want to greet each one. We **could** do
```java
String[] names = { "Tommy", "Lance", "Cortez" };
System.out.println("Hello, " + names[0] + "!");
System.out.println("Hello, " + names[1] + "!");
System.out.println("Hello, " + names[2] + "!");
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
String[] names = { "Tommy", "Lance", "Cortez" };

for (String name : names) {
    System.out.println("Hello, " + name + "!");
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
int[] prices = { 10, 20, 30, 40 };
int total = 0;
for (int price : prices) {
    total = total + price;
}
System.out.println(total);
```
Output **100**. Start with **total = 0**, walk through every price, add it to total. You will write this kind of loop **a lot** in your career. Read it line by line until it’s second nature :)

---

You have an array **scores** with the values **{80, 95, 60, 72, 88}**

Display **on separate lines**

1. Each score (one per line)
2. The **total** of all scores
3. The **average** (total divided by the number of scores)

Expected output
```text
80
95
60
72
88
395
79.0
```

**Tip**: for the average, **be careful with integer division** :) If you divide **total / scores.length** as ints, you’ll get **79**, not **79.0**. Cast one of them to a **double**, like this
```java
double average = (double) total / scores.length;
```

The **(double)** in front says "treat this value as a double, not an int". This is called a **cast** :)
