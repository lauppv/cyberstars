A method can call other methods. It can also call **itself**. That is called **recursion**. It sounds strange at first, but it is a clean way to solve a problem that contains a smaller copy of the same problem

---

Here is a countdown written with recursion instead of a loop

```java
public class Main {
    static void countdown(int n) {
        if (n == 0) {
            System.out.println("Liftoff!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }

    public static void main(String[] args) {
        countdown(3);
    }
}
```

Output

```text
3
2
1
Liftoff!
```

`countdown(3)` prints 3 and then calls `countdown(2)`, which prints 2 and calls `countdown(1)`, and so on. When `n` reaches 0, the method prints `Liftoff!` and stops calling itself

---

Every recursive method needs two parts:

1. **The base case**: the small problem you can answer right away, without calling yourself. Here, `n == 0`
2. **The recursive step**: you call yourself with a smaller problem, one that gets closer to the base case. Here, `n - 1`

Forget the base case, or call yourself with a problem that never gets smaller, and the method calls itself forever. Java runs out of room for all those calls and stops with a `StackOverflowError`

---

A recursive method can give back a value too. The factorial of n is `n × (n-1) × ... × 1`. Notice that `5!` is just `5 × 4!`. That is the smaller copy of the problem

```java
public class Main {
    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}
```

Output

```text
120
```

`factorial(5)` waits for `factorial(4)`, which waits for `factorial(3)`, down to `factorial(1)`, which answers 1. Then the answers come back up: 2, 6, 24, 120

---

That waiting is important. Every call keeps its own `n` and waits until the call it made comes back. So code written **after** the recursive call runs on the way back, in the opposite order

```java
public class Main {
    static void climb(int floor) {
        if (floor == 0) {
            System.out.println("Ground");
            return;
        }
        System.out.println("Down from " + floor);
        climb(floor - 1);
        System.out.println("Up to " + floor);
    }

    public static void main(String[] args) {
        climb(2);
    }
}
```

Output

```text
Down from 2
Down from 1
Ground
Up to 1
Up to 2
```

---

## Mission: Boxes in Boxes

Tommy hid the cash in a box, inside a box, inside a box. Write a recursive method `open` that takes how many boxes are left. Opening a box prints `Opening box N` and then opens the next box inside it. When no boxes are left, print `Found the cash!`. On the way back out, every box prints `Closing box N`.

Store the number of boxes in an `int` named `boxes` and call `open` with it. Don't use a loop.

**Example** for `boxes = 3`

```text
Opening box 3
Opening box 2
Opening box 1
Found the cash!
Closing box 1
Closing box 2
Closing box 3
```

**Example** for `boxes = 1`

```text
Opening box 1
Found the cash!
Closing box 1
```

**Example** for `boxes = 0`

```text
Found the cash!
```
