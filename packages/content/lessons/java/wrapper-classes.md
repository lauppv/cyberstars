`int`, `double`, `boolean` and `char` are not objects. They are simple values, which makes them fast. But some parts of Java only work with objects, like `ArrayList`. For that, every simple type has a **wrapper class**: an object that holds one value

---

The pairs:

- `int` → `Integer`
- `double` → `Double`
- `boolean` → `Boolean`
- `char` → `Character`

You already used two of them. `ArrayList<Integer>` is a list of Integer objects, because `ArrayList<int>` isn't allowed. And `Character.isDigit` comes from the Character class

---

Java moves between the two forms for you. Putting an `int` where an `Integer` is needed is called **autoboxing**. Taking the `int` back out is **unboxing**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(40);
        scores.add(15);

        int first = scores.get(0);
        int sum = scores.get(0) + scores.get(1);
        System.out.println(first);
        System.out.println(sum);
    }
}
```

Output

```text
40
55
```

`scores.add(40)` wraps 40 into an Integer. `int first = scores.get(0)` unwraps it. You never had to write any of it

---

The wrapper classes also hold useful helpers and constants

```java
public class Main {
    public static void main(String[] args) {
        int n = Integer.parseInt("250");
        double d = Double.parseDouble("2.5");
        System.out.println(n + 1);
        System.out.println(d * 2);
        System.out.println(Integer.MAX_VALUE);
        System.out.println(Integer.MIN_VALUE);
    }
}
```

Output

```text
251
5.0
2147483647
-2147483648
```

`Integer.MAX_VALUE` is the biggest number an `int` can hold. It is a good starting value when you look for the smallest number in a list: anything you find is smaller or equal

---

Two traps. First, a wrapper can be `null`, a simple type can't. Unboxing a `null` crashes with a `NullPointerException`

Second, `==` on two Integer objects asks if they are the same object, not if the numbers match. For small numbers Java reuses the same objects, so `==` seems to work, and then it fails for big ones

```java
public class Main {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        Integer c = 1000;
        Integer d = 1000;
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));
    }
}
```

Output

```text
true
false
true
```

Same rule as with Strings: compare wrapper objects with `equals`

---

## Mission: Lost and Found

The Vice City police typed a list of locker numbers, but some entries got mixed up with words. Store the entries in a `String` array named `entries`.

For every entry that is a whole number, add it to an `ArrayList<Integer>`. Entries that aren't numbers are bad. Use `Integer.parseInt` and catch the error it throws on a bad entry. Then print:

1. `Numbers: [...]`, the list as ArrayList prints it
2. `Bad: N`, how many entries weren't numbers
3. `Smallest: N`, the smallest number, or `Smallest: none` when there are no numbers. Start the search from `Integer.MAX_VALUE`

**Example** for `entries = { "42", "tape", "-7", "300" }`

```text
Numbers: [42, -7, 300]
Bad: 1
Smallest: -7
```

**Example** for `entries = { "abc", "" }`

```text
Numbers: []
Bad: 2
Smallest: none
```
