Java can sort any ArrayList of Strings or numbers with **Collections.sort()** — just import it from `java.util`

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Tommy");
        names.add("Cortez");
        names.add("Lance");

        Collections.sort(names);

        for (String n : names) {
            System.out.println(n);
        }
    }
}
```

Output

```text
Cortez
Lance
Tommy
```

`Collections.sort()` sorts **in place** — it modifies the original list directly. Strings are sorted **alphabetically**, numbers **ascending**

---

Want **reverse** order? Use `Collections.reverse()` after sorting

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(42);
        scores.add(95);

        Collections.sort(scores);
        Collections.reverse(scores);

        for (int s : scores) {
            System.out.println(s);
        }
    }
}
```

Output

```text
95
88
42
```

`reverse()` doesn't sort — it just **flips** the current order. To get descending order, sort first then reverse

---

But how do you sort a list of **objects**? If you have an `ArrayList<Car>`, Java doesn't know what to sort by — name? speed? You have to tell it by implementing the **Comparable** interface

```java
import java.util.ArrayList;
import java.util.Collections;

class Car implements Comparable<Car> {
    String name;
    int speed;

    Car(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }

    public int compareTo(Car other) {
        return this.speed - other.speed;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Car> garage = new ArrayList<>();
        garage.add(new Car("Infernus", 240));
        garage.add(new Car("Admiral", 150));
        garage.add(new Car("Cheetah", 230));

        Collections.sort(garage);

        for (Car c : garage) {
            System.out.println(c.name + " - " + c.speed + " km/h");
        }
    }
}
```

Output

```text
Admiral - 150 km/h
Cheetah - 230 km/h
Infernus - 240 km/h
```

Let's trace what happens:

1. `Car implements Comparable<Car>` — the class promises it knows how to compare itself with other cars
2. The `compareTo` method returns a number:
   - **negative** if `this` comes before `other`
   - **zero** if they're equal
   - **positive** if `this` comes after `other`
3. `this.speed - other.speed` sorts ascending by speed

For **descending** order, flip it: `other.speed - this.speed`

---

To sort by **String** (e.g., by name), use String's own `.compareTo()`

```java
public int compareTo(Car other) {
    return this.name.compareTo(other.name);
}
```

---

## Mission: Crew Ranking

Cortez wants a crew ranking sorted by number of completed missions — from least productive to most active. Tommy completed 47 missions, Lance 12, Phil 8, and Mercedes 23

Build a class for crew members that implements `Comparable` and compares by mission count. Create an ArrayList with all members, sort it, and print the ranking

**Example**

```text
Phil - 8 missions
Lance - 12 missions
Mercedes - 23 missions
Tommy - 47 missions
```
