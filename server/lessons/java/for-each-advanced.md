You already know the for-each loop. Now let's level it up with some **common patterns** you'll use all the time when working with collections. Think of these as your go-to moves — like how Tommy always has a few reliable weapons in his inventory

---

**Pattern 1: Finding the maximum value**

Loop through the list, keep track of the biggest number you've seen so far

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(42);
        scores.add(95);
        scores.add(67);

        int max = scores.get(0);
        for (int s : scores) {
            if (s > max) {
                max = s;
            }
        }
        System.out.println("Max: " + max);
    }
}
```

Output

```text
Max: 95
```

We start with `max = scores.get(0)` (the first element) and then check each value. If we find something bigger, we update `max`. Same idea for minimum — just flip the `>` to `<`

---

**Pattern 2: Filtering into a new list**

Sometimes you want to grab only the elements that match a condition. Create a new list and add only the ones you want

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(42);
        scores.add(95);
        scores.add(67);

        ArrayList<Integer> highScores = new ArrayList<>();
        for (int s : scores) {
            if (s >= 80) {
                highScores.add(s);
            }
        }

        System.out.println("High scores: " + highScores);
    }
}
```

Output

```text
High scores: [88, 95]
```

This is like filtering your Vice City garage — keep the fast cars, ditch the slow ones

---

**Pattern 3: Counting matches**

How many elements match a condition? Use a counter

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");
        crew.add("Phil");
        crew.add("Cortez");
        crew.add("Ken");

        int longNames = 0;
        for (String name : crew) {
            if (name.length() > 4) {
                longNames++;
            }
        }
        System.out.println("Names longer than 4 chars: " + longNames);
    }
}
```

Output

```text
Names longer than 4 chars: 3
```

---

**Pattern 4: Building a result string**

Sometimes you want to combine elements into a single string, maybe with a separator

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");
        crew.add("Phil");

        String result = "";
        for (int i = 0; i < crew.size(); i++) {
            if (i > 0) {
                result += ", ";
            }
            result += crew.get(i);
        }
        System.out.println("Crew: " + result);
    }
}
```

Output

```text
Crew: Tommy, Lance, Phil
```

We use a regular for loop here instead of for-each because we need the **index** to know whether to add the comma. The first element (index 0) gets no comma before it

---

**Combining patterns**

You can mix these patterns. Here we filter AND count in one loop

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> prices = new ArrayList<>();
        prices.add(150);
        prices.add(30);
        prices.add(250);
        prices.add(45);
        prices.add(500);

        int expensiveCount = 0;
        int cheapest = prices.get(0);

        for (int p : prices) {
            if (p > 100) {
                expensiveCount++;
            }
            if (p < cheapest) {
                cheapest = p;
            }
        }

        System.out.println("Expensive items: " + expensiveCount);
        System.out.println("Cheapest: $" + cheapest);
    }
}
```

Output

```text
Expensive items: 3
Cheapest: $30
```

---

Your turn! Given an ArrayList of integers: `15, 8, 22, 3, 41, 7, 30` — find and print the **maximum value**. Your output should be exactly:

```text
41
```

Just print the number, nothing else
