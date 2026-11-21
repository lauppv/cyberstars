In a generic method you know nothing about `T`, so you can only call what every object has. But what if you need more? To find the biggest item you must compare items. To add numbers you need them to be numbers. A **bounded type** sets a limit: `T` can be any type, as long as it is a certain kind

---

`<T extends Comparable<T>>` means: any type that knows how to compare itself, like String, Integer or Double. Now you may call `compareTo`

```java
public class Main {
    static <T extends Comparable<T>> T biggest(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(biggest(4, 9));
        System.out.println(biggest("Lance", "Ken"));
    }
}
```

Output

```text
9
Lance
```

`compareTo` gives a positive number when `a` comes after `b`. For Strings that means later in the alphabet, so `"Lance"` wins over `"Ken"`

Try to call `biggest` with two objects of a class that doesn't implement Comparable, and Java refuses to compile. That is the bound doing its job

---

`<T extends Number>` means: any kind of number. Integer, Double and Long all extend the class `Number`, which gives every one of them `doubleValue()`

```java
import java.util.ArrayList;

public class Main {
    static <T extends Number> double sum(ArrayList<T> values) {
        double total = 0;
        for (T v : values) {
            total += v.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        ArrayList<Integer> ints = new ArrayList<>();
        ints.add(3);
        ints.add(4);
        ArrayList<Double> doubles = new ArrayList<>();
        doubles.add(1.5);
        System.out.println(sum(ints));
        System.out.println(sum(doubles));
    }
}
```

Output

```text
7.0
1.5
```

`extends` here works for interfaces too, like Comparable. In a bound it just means "is a kind of"

---

There is a shorter way to write a method like `sum`. When you don't need the name `T` anywhere else, write the list's type as `ArrayList<? extends Number>`: "a list of some kind of number". The `?` is called a **wildcard**

```java
import java.util.ArrayList;

public class Main {
    static double sum(ArrayList<? extends Number> values) {
        double total = 0;
        for (Number v : values) {
            total += v.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        ArrayList<Integer> ints = new ArrayList<>();
        ints.add(10);
        System.out.println(sum(ints));
    }
}
```

Output

```text
10.0
```

Why not just `ArrayList<Number>`? Because an `ArrayList<Integer>` is not an `ArrayList<Number>`, even though every Integer is a Number. The wildcard is what lets both kinds of list in

---

One more tool before the mission. To make a list that already holds some values, in one line, use `List.of` inside the ArrayList's parentheses. It needs `import java.util.List;`

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>(List.of("Tommy", "Lance"));
        crew.add("Ken");
        System.out.println(crew);
    }
}
```

Output

```text
[Tommy, Lance, Ken]
```

---

## Mission: Race Board

Write two methods for Tommy's race board:

- `best(ArrayList<T> items)`, a generic method with `T extends Comparable<T>`, gives back the biggest item, using `compareTo`
- `total(ArrayList<? extends Number> values)` gives back the sum of the values as a `double`

In `main`, store names in an `ArrayList<String>` named `names`, scores in an `ArrayList<Integer>` named `scores` and lap times in an `ArrayList<Double>` named `times`. Make each list with `List.of`. Every list has at least one item. Print:

```text
Last name: <the name that comes last in the alphabet>
Top score: <the biggest score>
Score total: <the sum of the scores>
Time total: <the sum of the times>
```

**Example** for `names = [Tommy, Ken, Lance]`, `scores = [120, 85, 40]` and `times = [61.5, 58.25]`

```text
Last name: Tommy
Top score: 120
Score total: 245.0
Time total: 119.75
```

**Example** for `names = [Phil]`, `scores = [-3]` and `times = [0.5]`

```text
Last name: Phil
Top score: -3
Score total: -3.0
Time total: 0.5
```
