An ArrayList keeps everything you give it, even the same thing twice. Sometimes you want the opposite: every item only once. For that, Java has the **HashSet**

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> cars = new HashSet<>();
        cars.add("Infernus");
        cars.add("Cheetah");
        cars.add("Infernus");

        System.out.println(cars.size());
    }
}
```

Output

```text
2
```

We added "Infernus" twice, but the set keeps it only once. A set never has duplicates

---

The main methods look like the ones you know from ArrayList

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> crew = new HashSet<>();
        crew.add("Tommy");
        crew.add("Lance");
        crew.add("Phil");

        // contains: is it in the set?
        System.out.println(crew.contains("Lance"));
        System.out.println(crew.contains("Sonny"));

        // remove: takes it out
        crew.remove("Phil");
        System.out.println(crew.size());
    }
}
```

Output

```text
true
false
2
```

`contains` is the big reason to use a set. On a long ArrayList, Java checks the items one by one. A HashSet finds the answer almost at once, no matter how big it is

---

There is one more trick. `add` gives back a boolean: `true` if the item was new, `false` if it was already there

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> seen = new HashSet<>();
        System.out.println(seen.add("Diaz"));   // new
        System.out.println(seen.add("Diaz"));   // already there
    }
}
```

Output

```text
true
false
```

So one call can add the item and tell you if you saw it before

---

A HashSet has no order. If you print it, or loop over it, the items can come out in any order. Never count on it

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] calls = {"Lance", "Tommy", "Lance", "Kent", "Tommy"};
        HashSet<String> callers = new HashSet<>();

        for (String name : calls) {
            if (callers.add(name)) {
                System.out.println("First call from " + name);
            }
        }
        System.out.println("Different callers: " + callers.size());
    }
}
```

Output

```text
First call from Lance
First call from Tommy
First call from Kent
Different callers: 3
```

Here the order is fine, because we print while we walk through the array, not through the set

---

## Mission: The Guest List

Tonight Lance stands at the door of the Malibu Club. He writes down every name that walks in. Some people go out for air and come back, so their name shows up again. Tommy wants to know who is new and who is already inside

The names are in a `String[] entries` array, in the order people came in. Go through them. The first time a name shows up, print `New guest: name`. When it shows up again, print `Already inside: name`. At the end print `Unique guests: ` and how many different people came

**Example**

```text
New guest: Tommy
New guest: Lance
Already inside: Tommy
New guest: Mercedes
Already inside: Lance
New guest: Phil
Unique guests: 4
```

**Example**

```text
New guest: Kent
Already inside: Kent
Already inside: Kent
Unique guests: 1
```
