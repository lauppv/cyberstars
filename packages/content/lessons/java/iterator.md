You often want to walk through a list and throw some items out. With a for-each loop, that goes wrong

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Snitch");
        crew.add("Tommy");
        crew.add("Lance");

        for (String name : crew) {
            if (name.equals("Snitch")) {
                crew.remove(name);
            }
        }
        System.out.println(crew);
    }
}
```

The program stops with a `ConcurrentModificationException`. The for-each loop does not like it when the list changes under its feet

---

The answer is an **Iterator**. It is a small helper that walks through a collection one item at a time, and it is allowed to remove the item it is on

- `list.iterator()`: gives you an iterator at the start of the list
- `hasNext()`: is there one more item?
- `next()`: moves to the next item and gives it back
- `remove()`: removes the item that `next()` just gave you

```java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Snitch");
        crew.add("Lance");

        Iterator<String> it = crew.iterator();
        while (it.hasNext()) {
            String name = it.next();
            if (name.equals("Snitch")) {
                it.remove();
            }
        }
        System.out.println(crew);
    }
}
```

Output

```text
[Tommy, Lance]
```

Here `it.remove()` is safe, because the iterator itself does the removing and knows where it is

---

An iterator works on every collection: ArrayList, HashSet, the keys of a TreeMap. In fact, a for-each loop uses an iterator behind the scenes. You only need one yourself when you want to remove while you walk

```java
import java.util.Iterator;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> debts = new TreeMap<>();
        debts.put("Kent", 0);
        debts.put("Lance", 300);
        debts.put("Phil", 0);

        Iterator<String> it = debts.keySet().iterator();
        while (it.hasNext()) {
            String name = it.next();
            if (debts.get(name) == 0) {
                it.remove();
            }
        }
        System.out.println(debts);
    }
}
```

Output

```text
{Lance=300}
```

Removing a key through `keySet()` removes it from the map too

---

Two rules to remember

- Call `next()` before `remove()`. `remove()` removes the item you got last
- Call `remove()` once per `next()`. A second `remove()` in a row stops the program

---

## Mission: Bad Offers

People want to buy Tommy's businesses, and the offers pile up. Tommy is busy, so he wants the small offers gone before he reads the list

The offers are in an `int[] offers` array, and the smallest offer Tommy will look at is in `int minimum`. Put the offers in an ArrayList in the same order. Then walk through it and remove every offer below `minimum`. Print `Kept: ` with the list that is left, then `Removed: ` with how many you took out

**Example**

```text
Kept: [9000, 12000, 7500]
Removed: 3
```

**Example**

```text
Kept: []
Removed: 2
```
