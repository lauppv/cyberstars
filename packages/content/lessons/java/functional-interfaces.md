A lambda can go into a variable too. But a variable needs a type. The type of a lambda is a **functional interface**: an interface with exactly one method to fill in

Java has ready-made ones in `java.util.function`. The four you will meet most

- `Predicate<T>`: takes a T, answers true or false. You call it with `test`
- `Function<T, R>`: takes a T, gives back an R. You call it with `apply`
- `Consumer<T>`: takes a T, gives back nothing. You call it with `accept`
- `Supplier<T>`: takes nothing, gives back a T. You call it with `get`

```java
import java.util.function.Function;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        Predicate<Integer> isBig = n -> n > 1000;
        Function<Integer, Integer> doubled = n -> n * 2;

        System.out.println(isBig.test(5000));
        System.out.println(isBig.test(10));
        System.out.println(doubled.apply(21));
    }
}
```

Output

```text
true
false
42
```

---

`Consumer` and `Supplier` work the same way

```java
import java.util.function.Consumer;
import java.util.function.Supplier;

public class Main {
    public static void main(String[] args) {
        Consumer<String> shout = s -> System.out.println(s.toUpperCase() + "!");
        Supplier<String> boss = () -> "Tommy";

        shout.accept("hands up");
        System.out.println(boss.get());
    }
}
```

Output

```text
HANDS UP!
Tommy
```

There is also `BiFunction<A, B, R>`, which takes two inputs. You call it with `apply(a, b)`

---

Why put a lambda in a variable? So you can pass behaviour to your own methods. Here one method can count anything, and the lambda decides what counts

```java
import java.util.function.Predicate;

public class Main {
    static int count(int[] values, Predicate<Integer> rule) {
        int n = 0;
        for (int v : values) {
            if (rule.test(v)) {
                n++;
            }
        }
        return n;
    }

    public static void main(String[] args) {
        int[] sales = {300, 1200, 50, 900, 4000};

        System.out.println(count(sales, s -> s > 1000));
        System.out.println(count(sales, s -> s < 100));
    }
}
```

Output

```text
2
1
```

---

You can make your own functional interface too. Put `@FunctionalInterface` on it, so Java checks it has only one method

```java
@FunctionalInterface
interface Tax {
    int on(int amount);
}

public class Main {
    public static void main(String[] args) {
        Tax normal = a -> a / 10;
        Tax friend = a -> 0;

        System.out.println(normal.on(5000));
        System.out.println(friend.on(5000));
    }
}
```

Output

```text
500
0
```

Every lambda you wrote before was one of these. `removeIf` takes a Predicate, `forEach` takes a Consumer, `sort` takes a Comparator

---

## Mission: Sale Day

It is sale day at Sunshine Autos. Every car above a price limit gets a discount. The cheaper cars keep their price

The prices are in an `int[] prices` array, the limit is in `int limit` and the discount in `int percent`. Make a `Predicate<Integer>` that says if a price is above the limit, and a `Function<Integer, Integer>` that gives the new price: the price minus `price * percent / 100`. For each price, print `price -> new price` when it gets the discount, or `price stays` when it doesn't. At the end, print `Total: ` and the sum of all the prices after the sale

**Example**

```text
20000 stays
100000 -> 80000
50000 stays
60000 -> 48000
Total: 198000
```

**Example**

```text
999 -> 990
Total: 990
```
