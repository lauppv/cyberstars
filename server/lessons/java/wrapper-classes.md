Java has two worlds: **primitives** (`int`, `double`, `boolean`) and **objects** (`String`, `Player`, arrays). Most of the time they live in harmony. But sometimes you need a primitive to act like an object — and that's where **wrapper classes** come in

---

## The Problem

Java's collections (like `ArrayList`) only work with objects. You can't do this:

```java
public class Main {
    public static void main(String[] args) {
        ArrayList<int> numbers = new ArrayList<int>();  // ERROR!
    }
}
```

`int` isn't an object — it's a primitive. Java needs an object version of `int`. Enter `Integer`:

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<Integer>();
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        System.out.println(numbers);
    }
}
```

Output

```text
[10, 20, 30]
```

`Integer` is the **wrapper class** for `int`. It wraps the primitive value inside an object

---

## Every Primitive Has a Wrapper

| Primitive | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |
| `long`    | `Long`      |
| `float`   | `Float`     |
| `byte`    | `Byte`      |
| `short`   | `Short`     |

The pattern: capitalize the name (and `int` becomes `Integer`, `char` becomes `Character` — the two weird ones)

---

## Autoboxing and Unboxing

Java is smart enough to convert between primitives and wrappers automatically. This is called **autoboxing** (primitive to object) and **unboxing** (object to primitive):

```java
public class Main {
    public static void main(String[] args) {
        // Autoboxing: int -> Integer
        Integer a = 42;          // Java wraps 42 in an Integer object

        // Unboxing: Integer -> int
        int b = a;               // Java unwraps the Integer back to int

        System.out.println(a);   // 42
        System.out.println(b);   // 42

        // Works in expressions too
        Integer x = 10;
        int result = x + 5;     // x gets unboxed, added to 5
        System.out.println(result);  // 15
    }
}
```

Output

```text
42
42
15
```

You rarely need to think about this — Java handles the conversion. But it's good to know what's happening under the hood

---

## Why ArrayList Needs Wrappers

`ArrayList` stores objects, not primitives. So you use `Integer` instead of `int`, `Double` instead of `double`, and so on:

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<Integer>();
        scores.add(100);    // autoboxing: 100 -> Integer
        scores.add(85);
        scores.add(92);

        int first = scores.get(0);  // unboxing: Integer -> int
        System.out.println("First score: " + first);
        System.out.println("All scores: " + scores);
    }
}
```

Output

```text
First score: 100
All scores: [100, 85, 92]
```

---

## Useful Wrapper Methods

Wrapper classes come with handy utility methods:

```java
public class Main {
    public static void main(String[] args) {
        // Parse strings to numbers
        int x = Integer.parseInt("42");
        double y = Double.parseDouble("3.14");
        System.out.println(x + y);

        // Get min/max values
        System.out.println("Max int: " + Integer.MAX_VALUE);
        System.out.println("Min int: " + Integer.MIN_VALUE);

        // Convert to string
        String s = Integer.toString(100);
        System.out.println("String: " + s);
    }
}
```

Output

```text
45.14
Max int: 2147483647
Min int: -2147483648
String: 100
```

`Integer.parseInt()` is especially useful — you've probably needed to convert a string to a number before. That's how you do it in Java

---

## Wrappers Can Be null (Careful!)

Since wrappers are objects, they can be `null` — unlike primitives:

```java
public class Main {
    public static void main(String[] args) {
        Integer a = null;    // fine — Integer is an object
        // int b = null;     // ERROR — int is a primitive

        // But watch out for unboxing null:
        // int c = a;        // NullPointerException! Can't unbox null
        if (a != null) {
            int c = a;
            System.out.println(c);
        } else {
            System.out.println("a is null!");
        }
    }
}
```

Output

```text
a is null!
```

This is a sneaky source of bugs. If an `Integer` is null and you try to unbox it to `int`, you get a `NullPointerException`. Tommy Vercetti's least favorite exception

---

## Python Comparison

Python doesn't have this problem at all — everything is already an object. `42` is an `int` object, `3.14` is a `float` object. There's no primitive/object split

```python
numbers = [10, 20, 30]  # just works
```

Java's two-world system (primitives vs objects) is the main reason wrapper classes exist. It's one of those quirks you learn to live with

---

## Exercise

Create an `ArrayList<Integer>` with five numbers: `10`, `20`, `30`, `40`, `50`. Use a for loop to calculate the sum, then print it

Expected output:

```text
150
```
