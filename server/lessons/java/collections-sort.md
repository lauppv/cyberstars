In Python, sorting a list is as easy as `my_list.sort()`. Java has something very similar for ArrayLists: **Collections.sort()**

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

        for (String name : names) {
            System.out.println(name);
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

**Collections.sort()** sorts the list **in place** — it modifies the original list directly, just like Python's `.sort()`. For strings, it sorts **alphabetically** (A-Z). For numbers, it sorts **smallest to largest**

---

You need to **import** `java.util.Collections` at the top of your file (notice: `Collections` with an **s** — it's different from `Collection`). This is a utility class full of handy methods for working with lists

Let's sort some numbers

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(42);
        scores.add(95);
        scores.add(67);

        Collections.sort(scores);

        for (int s : scores) {
            System.out.println(s);
        }
    }
}
```
Output
```text
42
67
88
95
```

---

Want to sort in **reverse** order? Use **Collections.reverse()** after sorting — it flips the list around

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(42);
        scores.add(95);
        scores.add(67);

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
67
42
```

Now the scores go from highest to lowest. Think of it like a Vice City leaderboard — the top player first

---

**Collections.reverse()** doesn't sort — it just **flips** whatever order the list is in. So if you call reverse without sorting first, you just get the original list backwards

```java
ArrayList<String> crew = new ArrayList<>();
crew.add("Tommy");
crew.add("Lance");
crew.add("Phil");

Collections.reverse(crew);
// Now it's: Phil, Lance, Tommy (reversed insertion order, NOT sorted)
```

To get reverse alphabetical order, you need **sort first, then reverse**

---

Here's a quick comparison with Python

```python
# Python
names = ["Cortez", "Tommy", "Lance"]
names.sort()           # sorts in place
names.reverse()        # reverses in place
```

```java
// Java
ArrayList<String> names = new ArrayList<>();
names.add("Cortez");
names.add("Tommy");
names.add("Lance");
Collections.sort(names);       // sorts in place
Collections.reverse(names);    // reverses in place
```

Pretty similar, right? The main difference is that Java uses a separate **Collections** utility class instead of methods directly on the list

---

Your turn! Create an ArrayList of Strings with these names: `"Cortez"`, `"Tommy"`, `"Lance"`, `"Phil"`. Sort them **alphabetically** using Collections.sort(), then print each name on its own line