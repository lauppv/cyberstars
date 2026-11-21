A stream ends with one last step that gives you a result. You already know `forEach`, `count` and `toList`. This lesson shows two more: **collect** and **reduce**

---

`collect` gathers the items with a **Collector**. The ready-made collectors live in `Collectors`. `joining` glues Strings together, with a separator between them

```java
import java.util.ArrayList;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");
        crew.add("Phil");

        String line = crew.stream().collect(Collectors.joining(", "));
        System.out.println(line);
    }
}
```

Output

```text
Tommy, Lance, Phil
```

`Collectors.toList()` collects into a list, like `toList()`. `Collectors.toSet()` collects into a set

---

`groupingBy` sorts the items into groups. Together with `counting()`, it tells you how many items each group has

```java
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> weapons = new ArrayList<>();
        weapons.add("Pistol");
        weapons.add("Uzi");
        weapons.add("Pistol");

        Map<String, Long> count = weapons.stream()
            .collect(Collectors.groupingBy(w -> w, Collectors.counting()));
        System.out.println(new TreeMap<>(count));
    }
}
```

Output

```text
{Pistol=2, Uzi=1}
```

The lambda `w -> w` says what to group by: here, the weapon itself. The result is a map, which we put in a TreeMap to print it sorted

---

`reduce` boils all the items down to one value. You give it a start value and a way to join two values

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> cash = new ArrayList<>();
        cash.add(500);
        cash.add(1200);
        cash.add(300);

        int total = cash.stream().reduce(0, (a, b) -> a + b);
        int biggest = cash.stream().reduce(0, Integer::max);

        System.out.println(total);
        System.out.println(biggest);
    }
}
```

Output

```text
2000
1200
```

For the total, `reduce` starts at 0, then adds 500, then 1200, then 300. For the biggest, it keeps the larger of two values each time

---

For numbers there is a shortcut. `mapToInt` turns the stream into a stream of ints, and that one has `sum()`, `max()` and `average()`

```java
import java.util.ArrayList;

record Sale(String place, int amount) {}

public class Main {
    public static void main(String[] args) {
        ArrayList<Sale> week = new ArrayList<>();
        week.add(new Sale("Malibu Club", 5000));
        week.add(new Sale("Pole Position", 3000));

        int total = week.stream().mapToInt(Sale::amount).sum();
        System.out.println(total);
    }
}
```

Output

```text
8000
```

---

One more step that is handy before a collect: `distinct()` drops the repeats, so each item comes once

---

## Mission: The Weekly Take

Every Sunday, Tommy reads what his businesses brought in. He wants three lines: the total, the biggest single sale, and the names of the places that sold something

The places are in a `String[] places` array and the amounts in an `int[] amounts` array. `places[i]` made a sale of `amounts[i]`. There is always at least one sale. Put the sales in a list and use streams to print `Total: ` with the sum of all sales, `Biggest: ` with the biggest one, and `Places: ` with each place once, in alphabetical order, separated by a comma and a space. Use `reduce` and `collect`

**Example**

```text
Total: 16500
Biggest: 7000
Places: Malibu Club, Pole Position, Print Works
```

**Example**

```text
Total: 800
Biggest: 800
Places: Kaufman Cabs
```
