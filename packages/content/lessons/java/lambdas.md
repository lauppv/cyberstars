Remember the anonymous Comparator from before? A whole class, just to say "compare by length"

```text
names.sort(new Comparator<String>() {
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});
```

A **lambda** says the same thing in one short line

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Mercedes");
        names.add("Phil");
        names.add("Lance");

        names.sort((a, b) -> a.length() - b.length());
        System.out.println(names);
    }
}
```

Output

```text
[Phil, Lance, Mercedes]
```

`(a, b) -> a.length() - b.length()` is a lambda. On the left of the arrow are the inputs, on the right is what it gives back. Java sees that `sort` wants a Comparator, so it knows `a` and `b` are Strings

---

A lambda is a small piece of code you can pass to a method, like a value. It has a few shapes

```text
x -> x * 2                  // one input: no brackets needed
(a, b) -> a + b             // two inputs: brackets
() -> "hi"                  // no inputs: empty brackets
x -> {                      // more than one line: curly braces and return
    int y = x * 2;
    return y + 1;
}
```

---

Lists have methods that take a lambda. `forEach` runs it for every item

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> crew = new ArrayList<>();
        crew.add("Tommy");
        crew.add("Lance");

        crew.forEach(name -> System.out.println("Hi, " + name));
    }
}
```

Output

```text
Hi, Tommy
Hi, Lance
```

---

`removeIf` removes every item for which the lambda says `true`. No iterator needed

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> bribes = new ArrayList<>();
        bribes.add(500);
        bribes.add(20);
        bribes.add(1000);
        bribes.add(5);

        bribes.removeIf(b -> b < 100);
        System.out.println(bribes);
    }
}
```

Output

```text
[500, 1000]
```

---

A lambda can use variables from around it, as long as they never change after they get their value

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> prices = new ArrayList<>();
        prices.add(30000);
        prices.add(90000);
        prices.add(60000);

        int limit = 50000;
        prices.removeIf(p -> p > limit);
        System.out.println(prices);
    }
}
```

Output

```text
[30000]
```

If you write `limit = 1;` somewhere later, the program does not compile

---

## Mission: Within Budget

Lance wants a new car from Sunshine Autos, but he can pay only so much. He wants to see the cars he can afford, the most expensive first, because he wants the best one he can pay for

The prices of the cars on the lot are in an `int[] prices` array, and Lance's money is in `int budget`. Put the prices in an ArrayList. Remove every price above `budget`, sort the rest from the highest to the lowest, and print each one as `$price`. Then print `Options: ` and how many cars are left. Use lambdas for the removing, the sorting and the printing

**Example**

```text
$45000
$32000
$32000
$9000
Options: 4
```

**Example**

```text
Options: 0
```
