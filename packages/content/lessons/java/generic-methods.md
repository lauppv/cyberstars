A whole class can be generic, but so can a single method. A **generic method** has its own type parameter, so one method works for Strings, Integers, Cars, anything, and Java still checks the types

---

The type parameter goes in `< >` right before the return type

```java
public class Main {
    static <T> T firstOf(T[] items) {
        return items[0];
    }

    public static void main(String[] args) {
        String[] crew = { "Tommy", "Lance" };
        Integer[] scores = { 40, 15 };

        String leader = firstOf(crew);
        int top = firstOf(scores);
        System.out.println(leader);
        System.out.println(top);
    }
}
```

Output

```text
Tommy
40
```

You don't tell Java what `T` is when you call it. It sees a `String[]` and works out that `T` is `String` this time, and `Integer` the next time

---

A generic method can take an `ArrayList<T>` too, or several parameters of type `T`

```java
import java.util.ArrayList;

public class Main {
    static <T> void printAll(ArrayList<T> list) {
        for (T item : list) {
            System.out.println("- " + item);
        }
    }

    public static void main(String[] args) {
        ArrayList<String> cars = new ArrayList<>();
        cars.add("Infernus");
        cars.add("Cheetah");
        printAll(cars);
    }
}
```

Output

```text
- Infernus
- Cheetah
```

---

Inside a generic method, you know nothing about `T` except that it is an object. So you can call the methods every object has, like `equals` and `toString`. That is enough to compare items

```java
public class Main {
    static <T> boolean contains(T[] items, T target) {
        for (T item : items) {
            if (item.equals(target)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Integer[] codes = { 500, 1000, 2000 };
        System.out.println(contains(codes, 1000));
        System.out.println(contains(codes, 7));
    }
}
```

Output

```text
true
false
```

Use `equals` here, never `==`. Remember the Integer trap: `==` on two Integer objects can say false for the same number

---

## Mission: Counting Anything

Write two generic methods:

- `count(T[] items, T target)` gives back how many items are equal to the target
- `lastOf(T[] items)` gives back the last item

In `main`, store words in a `String` array named `words` and one word to look for in a `String` named `word`. Store numbers in an `Integer` array named `numbers` and one number to look for in an `Integer` named `number`. Using the same two methods for both, print:

```text
<word>: N times
<number>: N times
Last word: <the last word>
Last number: <the last number>
```

Both arrays always have at least one item.

**Example** for `words = { "cash", "gun", "cash" }`, `word = "cash"`, `numbers = { 1000, 5, 1000, 1000 }` and `number = 1000`

```text
cash: 2 times
1000: 3 times
Last word: cash
Last number: 1000
```

**Example** for `words = { "tape" }`, `word = "cash"`, `numbers = { 7, 8 }` and `number = 8`

```text
cash: 0 times
8: 1 times
Last word: tape
Last number: 8
```
