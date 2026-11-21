Printing an array, sorting it, copying it: you could write a loop for each of these. You don't have to. Java has the **Arrays** class, full of helpers for arrays. To use it, put `import java.util.Arrays;` at the very top of the file

---

First, printing. `System.out.println(array)` prints something odd, like `[I@1b6d3586`, the array's place in memory. `Arrays.toString` prints what is inside

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = { 40, 10, 30 };
        System.out.println(Arrays.toString(scores));
    }
}
```

Output

```text
[40, 10, 30]
```

---

Sorting. `Arrays.sort` puts the values in order, from small to big, or alphabetically for Strings

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = { 40, 10, 30 };
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores));

        String[] crew = { "Lance", "Ken", "Tommy" };
        Arrays.sort(crew);
        System.out.println(Arrays.toString(crew));
    }
}
```

Output

```text
[10, 30, 40]
[Ken, Lance, Tommy]
```

`Arrays.sort` changes the array you give it. The old order is gone

---

So how do you keep the old order? Make a copy first. `Arrays.copyOf(array, length)` gives back a new array with the first `length` values

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = { 40, 10, 30 };
        int[] sorted = Arrays.copyOf(scores, scores.length);
        Arrays.sort(sorted);
        System.out.println(Arrays.toString(scores));
        System.out.println(Arrays.toString(sorted));

        int[] firstTwo = Arrays.copyOf(sorted, 2);
        System.out.println(Arrays.toString(firstTwo));
    }
}
```

Output

```text
[40, 10, 30]
[10, 30, 40]
[10, 30]
```

Why not just `int[] sorted = scores;`? That doesn't copy anything. Both names would point to the same array, and sorting one would sort the other

---

Two more you will meet:

- `Arrays.fill(array, value)` sets every element to the same value
- `Arrays.equals(a, b)` is true when both arrays hold the same values in the same order

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] lights = new int[4];
        Arrays.fill(lights, 1);
        System.out.println(Arrays.toString(lights));

        int[] a = { 1, 2 };
        int[] b = { 1, 2 };
        System.out.println(a == b);
        System.out.println(Arrays.equals(a, b));
    }
}
```

Output

```text
[1, 1, 1, 1]
false
true
```

`a == b` asks "are these the same array?", and they are not, they are two arrays. `Arrays.equals` compares what is inside, like `.equals` does for Strings

---

## Mission: Race Results

Tommy's street racers just finished a race. Store their times, in seconds, in an `int` array named `times`, in the order they crossed the start line. Print:

1. `Start order: [...]`, the times as they came
2. `Sorted: [...]`, the times from fastest to slowest
3. `Podium: [...]`, the three fastest times. If there are fewer than three racers, the podium has all of them

The start order must stay as it was, even after you sort. Use the Arrays class for printing, sorting and copying.

**Example** for `times = { 61, 58, 70, 55 }`

```text
Start order: [61, 58, 70, 55]
Sorted: [55, 58, 61, 70]
Podium: [55, 58, 61]
```

**Example** for `times = { 90, 80 }`

```text
Start order: [90, 80]
Sorted: [80, 90]
Podium: [80, 90]
```
