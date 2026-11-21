With `Comparable`, a class has one way to sort itself, written inside the class. But a list of cars can be sorted by speed today and by name tomorrow. For that, you use a **Comparator**: a small object that knows how to compare two items

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

class Car {
    String name;
    int speed;

    Car(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }
}

class BySpeed implements Comparator<Car> {
    public int compare(Car a, Car b) {
        return a.speed - b.speed;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Car> garage = new ArrayList<>();
        garage.add(new Car("Infernus", 240));
        garage.add(new Car("Admiral", 150));
        garage.add(new Car("Cheetah", 230));

        Collections.sort(garage, new BySpeed());
        for (Car c : garage) {
            System.out.println(c.name + " " + c.speed);
        }
    }
}
```

Output

```text
Admiral 150
Cheetah 230
Infernus 240
```

`compare(a, b)` follows the same rule as `compareTo`: negative if a comes first, zero if they are equal, positive if b comes first. The `Car` class itself does not change at all

---

You can write as many comparators as you like, one for each order. And every comparator has a `reversed()` method that gives you the opposite order

```java
import java.util.ArrayList;
import java.util.Comparator;

class Car {
    String name;
    int speed;

    Car(String name, int speed) {
        this.name = name;
        this.speed = speed;
    }
}

class ByName implements Comparator<Car> {
    public int compare(Car a, Car b) {
        return a.name.compareTo(b.name);
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Car> garage = new ArrayList<>();
        garage.add(new Car("Infernus", 240));
        garage.add(new Car("Admiral", 150));
        garage.add(new Car("Cheetah", 230));

        garage.sort(new ByName());
        System.out.println(garage.get(0).name);

        garage.sort(new ByName().reversed());
        System.out.println(garage.get(0).name);
    }
}
```

Output

```text
Admiral
Infernus
```

`list.sort(comparator)` does the same as `Collections.sort(list, comparator)`. Use the one you like

---

For a comparator you use only once, you don't need a named class. An anonymous class is enough

```java
import java.util.ArrayList;
import java.util.Comparator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Mercedes");
        names.add("Phil");
        names.add("Lance");

        names.sort(new Comparator<String>() {
            public int compare(String a, String b) {
                return a.length() - b.length();
            }
        });
        System.out.println(names);
    }
}
```

Output

```text
[Phil, Lance, Mercedes]
```

Here we sorted Strings by their length, not alphabetically

---

One more thing: when two items are equal for the comparator, the sort keeps them in the order they had before. So you can count on it

---

## Mission: Race Results

Tommy organized a street race. Now he wants two lists: one by time, to see who won, and one by name, to pay everyone

The drivers are in a `String[] drivers` array and their times in seconds in an `int[] times` array. `drivers[i]` finished in `times[i]` seconds. Print `By time:`, then every driver as `name - time s`, fastest first. If two drivers have the same time, keep them in the order they are in the arrays. Then print `By name:` and the same lines in alphabetical order

**Example**

```text
By time:
Lance - 58 s
Tommy - 61 s
Candy - 61 s
Phil - 75 s
By name:
Candy - 61 s
Lance - 58 s
Phil - 75 s
Tommy - 61 s
```

**Example**

```text
By time:
Kent - 90 s
By name:
Kent - 90 s
```
