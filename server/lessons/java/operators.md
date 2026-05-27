We already saw **+**, **-**, **\***, and **/** in earlier lessons. Java has a few more useful operators that we’ll meet now

```java
public class Main {
    public static void main(String[] args) {
        int a = 17;
        int b = 5;

        System.out.println(a + b);   // addition
        System.out.println(a - b);   // subtraction
        System.out.println(a * b);   // multiplication
        System.out.println(a / b);   // division
        System.out.println(a % b);   // remainder (modulo)
    }
}
```

Output

```text
22
12
85
3
2
```

The interesting one is **a / b = 3**, not **3.4**. Why? Because **a** and **b** are both **int**. Java does **integer division** when both operands are integers — it throws away the decimal part. We saw this in an earlier lesson

If we want the decimal result, we need at least one **double**

```java
public class Main {
    public static void main(String[] args) {
        double a = 17;
        int b = 5;
        System.out.println(a / b);   // 3.4
    }
}
```

---

The new operator is **%**, called **modulo** (or "remainder"). It gives the **remainder** of the division

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(17 % 5);   // 2
        System.out.println(20 % 4);   // 0
    }
}
```

**17 / 5 = 3** with remainder **2**, so **17 % 5 = 2**. **20 / 4 = 5** exactly, so the remainder is **0**

**%** is incredibly useful. The classic example: checking if a number is **even**

```java
public class Main {
    public static void main(String[] args) {
        int n = 10;
        if (n % 2 == 0) {
            System.out.println("even");
        } else {
            System.out.println("odd");
        }
    }
}
```

---

Java has handy **shortcuts**

- **a++** is the same as **a = a + 1**
- **a--** is the same as **a = a - 1**
- **a += 5** is the same as **a = a + 5**
- **a -= 3** is the same as **a = a - 3**
- **a \*= 2** is the same as **a = a \* 2**
- **a /= 4** is the same as **a = a / 4**

You’ll see **i++** in **for** loops literally everywhere

---

What about **powers**? Unlike Python’s **\*\***, Java doesn’t have a power operator. We use **Math.pow**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.pow(2, 3));   // 8.0
    }
}
```

Output is **8.0** (a double). **Math.pow** always returns a double, so even **2 to the power of 3** comes out as **8.0**, not **8**

---

The **order of operations** is the same as in math. Multiplication and division before addition and subtraction

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(2 + 3 * 4);     // 14, not 20
        System.out.println((2 + 3) * 4);   // 20
    }
}
```

When in doubt, **add parentheses**. They make the code easier to read anyway :)

---

You have two variables **a** and **b** on the right. Display **on separate lines** the result of

```text
a + b
a - b
a * b
a / b
a % b
```

For **a = 17** and **b = 5** the output should be

```text
22
12
85
3
2
```

Play around with the values, **run** the code several times, see how the output changes :)
