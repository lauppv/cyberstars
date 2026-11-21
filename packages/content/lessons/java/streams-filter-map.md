Most loops over a list do the same few things: keep some items, change them, and do something with what is left. A **stream** lets you write those steps one after the other, like a recipe

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> sales = new ArrayList<>();
        sales.add(300);
        sales.add(1200);
        sales.add(50);
        sales.add(4000);

        sales.stream()
            .filter(s -> s > 100)
            .map(s -> s * 2)
            .forEach(s -> System.out.println(s));
    }
}
```

Output

```text
600
2400
8000
```

Read it from top to bottom: take the sales, keep the ones above 100, double each one, print each one

---

The steps you will use most

- `filter(test)`: keeps only the items for which the lambda says `true`
- `map(change)`: turns every item into something else
- `sorted()` or `sorted(comparator)`: puts the items in order
- `forEach(action)`: does something with every item, and ends the stream
- `count()`: counts the items, and ends the stream
- `toList()`: collects the items into a new list, and ends the stream

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");
        crew.add("Phil");
        crew.add("Mercedes");

        List<String> shortNames = crew.stream()
            .filter(n -> n.length() <= 5)
            .map(n -> n.toUpperCase())
            .sorted()
            .toList();
        long longNames = crew.stream().filter(n -> n.length() > 5).count();

        System.out.println(shortNames);
        System.out.println(longNames);
    }
}
```

Output

```text
[LANCE, PHIL, TOMMY]
1
```

`count()` gives back a `long`, a bigger kind of whole number. You can print it like an int

---

A stream never changes the list it came from. After all that work, `crew` still has its four names in the old order. And a stream is used only once: for new steps, call `stream()` again

---

Streams work great with records. `map` can pull one field out of each object

```java
import java.util.ArrayList;

record Car(String name, int speed) {}

public class Main {
    public static void main(String[] args) {
        ArrayList<Car> garage = new ArrayList<>();
        garage.add(new Car("Infernus", 240));
        garage.add(new Car("Admiral", 150));
        garage.add(new Car("Cheetah", 230));

        garage.stream()
            .filter(c -> c.speed() > 200)
            .sorted((a, b) -> a.speed() - b.speed())
            .map(c -> c.name())
            .forEach(System.out::println);
    }
}
```

Output

```text
Cheetah
Infernus
```

---

## Mission: Fast Cars

Diaz needs fast cars for a job tonight. He has a list of every car he can get, with its top speed. He wants only the fast ones, fastest first

The car names are in a `String[] cars` array and their top speeds in an `int[] speeds` array. `cars[i]` has top speed `speeds[i]`. The slowest speed Diaz will take is in `int minSpeed`. Put the cars in a list, then use a stream to keep the cars with a speed of at least `minSpeed`, sort them from fastest to slowest, and print each one as `name (speed km/h)`. If two cars have the same speed, keep the order from the arrays. Then print `Fast cars: ` and how many there are

**Example**

```text
Infernus (240 km/h)
Cheetah (230 km/h)
Banshee (230 km/h)
Fast cars: 3
```

**Example**

```text
Fast cars: 0
```
