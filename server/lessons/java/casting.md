Casting means converting a value from one type to another. In Python, you'd write `int(3.14)` or `float(42)`. Java has its own way of doing this, and it cares A LOT about whether the conversion is safe

---

**Widening** (safe, automatic): going from a smaller type to a bigger type. No data is lost

```java
public class Main {
    public static void main(String[] args) {
        int x = 42;
        double y = x;  // int -> double, automatic
        System.out.println(y);  // 42.0
    }
}
```

Java does this automatically because a `double` can hold any `int` value. It's like pouring a small cup of water into a big bucket — nothing spills

The widening chain: `byte -> short -> int -> long -> float -> double`

---

**Narrowing** (dangerous, manual): going from a bigger type to a smaller type. Data MIGHT be lost, so Java forces you to be explicit

```java
public class Main {
    public static void main(String[] args) {
        double price = 9.99;
        int rounded = (int) price;  // you MUST cast explicitly
        System.out.println(rounded);  // 9  (decimal part is CHOPPED, not rounded!)
    }
}
```

The `(int)` is the cast operator. You're telling Java "I know this might lose data, do it anyway." Without it, Java refuses to compile

Important: casting a double to int doesn't ROUND — it **truncates** (chops off the decimal). `9.99` becomes `9`, not `10`. If you want actual rounding, use `Math.round()`

---

```java
public class Main {
    public static void main(String[] args) {
        // Widening — automatic
        int score = 42;
        double precise = score;
        System.out.println(precise);  // 42.0

        // Narrowing — manual cast required
        double gpa = 3.87;
        int truncated = (int) gpa;
        System.out.println(truncated);  // 3
    }
}
```

---

Casting also works with **objects** in inheritance hierarchies

```java
class Animal {
    void speak() { System.out.println("..."); }
}

class Dog extends Animal {
    void fetch() { System.out.println("Fetching!"); }
}
```

**Upcasting** (child to parent, always safe):

```java
public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        Animal a = d;  // automatic, like widening
        a.speak();     // works fine
        // a.fetch();  // DOESN'T COMPILE — Animal doesn't know about fetch()
    }
}
```

**Downcasting** (parent to child, dangerous):

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();   // the object IS a dog
        Dog d = (Dog) a;        // explicit cast, like narrowing
        d.fetch();              // works because it really is a Dog
    }
}
```

But if the object ISN'T actually a Dog, you get a **ClassCastException** at runtime. That's why you check first

```java
public class Main {
    public static void main(String[] args) {
        Animal a = new Cat();
        if (a instanceof Dog) {
            Dog d = (Dog) a;  // this won't run because a is a Cat
        }
    }
}
```

It's like Tommy Vercetti trying to pretend he's Cortez. The disguise might work for a moment, but eventually things crash

---

Here's a quick reference

| Conversion    | Direction   | Safe?               | Syntax                    |
| ------------- | ----------- | ------------------- | ------------------------- |
| int to double | Widening    | Yes                 | `double d = myInt;`       |
| double to int | Narrowing   | No (loses decimals) | `int i = (int) myDouble;` |
| Dog to Animal | Upcasting   | Yes                 | `Animal a = myDog;`       |
| Animal to Dog | Downcasting | Maybe               | `Dog d = (Dog) myAnimal;` |

---

## Mission: Cargo Weight Converter

The cargo bay scanner reports a package weight as a decimal (`9.99` kg), but the manifest system only accepts whole numbers. Meanwhile, the precision scale needs a whole-number score (`42`) expanded to a decimal reading.

1. Cast `price` (a double) to an int and print it
2. Widen `score` (an int) to a double and print it

**Input** (already set at the top of your code — change the values to test):

- `price` — decimal weight reading (double)
- `score` — whole-number score (int)

**Example**

With `price = 9.99` and `score = 42`, your program should print

```text
9
42.0
```
