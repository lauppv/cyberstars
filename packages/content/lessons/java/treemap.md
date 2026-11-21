A HashMap has no order. Its keys come out however Java likes. A **TreeMap** works the same way, but it always keeps its keys sorted

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> missions = new TreeMap<>();
        missions.put("Tommy", 47);
        missions.put("Lance", 12);
        missions.put("Phil", 8);

        System.out.println(missions);
    }
}
```

Output

```text
{Lance=12, Phil=8, Tommy=47}
```

We added Tommy first, but the TreeMap shows the names in alphabetical order. Numbers as keys go from small to big

---

You use it like a HashMap: `put`, `get`, `containsKey`, `keySet`, `entrySet`. A loop over it always goes in sorted order

```java
import java.util.Map;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<Integer, String> floors = new TreeMap<>();
        floors.put(3, "Office");
        floors.put(1, "Lobby");
        floors.put(2, "Studio");

        for (Map.Entry<Integer, String> e : floors.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}
```

Output

```text
1: Lobby
2: Studio
3: Office
```

---

Because the keys are sorted, a TreeMap can give you the smallest and the biggest key at once

- `firstKey()`: the smallest key
- `lastKey()`: the biggest key

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> prices = new TreeMap<>();
        prices.put("Stinger", 90000);
        prices.put("Admiral", 25000);
        prices.put("Infernus", 150000);

        System.out.println("First: " + prices.firstKey());
        System.out.println("Last: " + prices.lastKey());
    }
}
```

Output

```text
First: Admiral
Last: Stinger
```

---

When you add up values per key, `getOrDefault(key, 0)` is handy. It gives the value of the key, or 0 if the key is not there yet

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] sales = {"Phil", "Kent", "Phil", "Phil"};
        TreeMap<String, Integer> count = new TreeMap<>();

        for (String name : sales) {
            count.put(name, count.getOrDefault(name, 0) + 1);
        }
        System.out.println(count);
    }
}
```

Output

```text
{Kent=1, Phil=3}
```

The first time we see Phil, `getOrDefault` gives 0, so Phil gets 1. Next time it gives 1, so Phil gets 2, and so on

---

## Mission: Sonny's Book

Sonny Forelli writes down every payment his people send him. The same person can pay many times. Sonny wants one clean page: each name once, with the total they paid, in alphabetical order

The names are in a `String[] names` array and the amounts in an `int[] amounts` array. `names[i]` paid `amounts[i]`. There is always at least one payment. Print each person as `name: total`, sorted by name. Then print `First: name` and `Last: name`, the first and the last name on the page

**Example**

```text
Lance: 3000
Tommy: 7000
Vic: 500
First: Lance
Last: Vic
```

**Example**

```text
Kent: 1200
First: Kent
Last: Kent
```
