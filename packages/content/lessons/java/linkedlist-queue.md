Think of the line at a garage. The first car that arrives is the first car that gets fixed. In Java, a line like this is a **Queue**: first in, first out

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> line = new LinkedList<>();
        line.offer("Infernus");
        line.offer("Cheetah");
        line.offer("Stinger");

        System.out.println(line.poll());
        System.out.println(line.poll());
        System.out.println(line);
    }
}
```

Output

```text
Infernus
Cheetah
[Stinger]
```

`Queue` says what the collection does: a line. `LinkedList` is the class that does the work behind it. You write `Queue<String>` on the left and `new LinkedList<>()` on the right

---

The queue methods

- `offer(x)`: puts x at the back of the line
- `poll()`: takes the first one out of the line and gives it back
- `peek()`: looks at the first one, but leaves it in the line
- `isEmpty()` and `size()`: is the line empty, and how long is it

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> calls = new LinkedList<>();
        calls.offer("Lance");
        calls.offer("Kent");

        System.out.println("Next: " + calls.peek());
        System.out.println("Waiting: " + calls.size());
    }
}
```

Output

```text
Next: Lance
Waiting: 2
```

`peek` did not remove Lance. He is still first in line

---

What happens when the line is empty? `poll()` and `peek()` don't crash, they give back `null`

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> line = new LinkedList<>();
        System.out.println(line.poll());
        System.out.println(line.isEmpty());
    }
}
```

Output

```text
null
true
```

So check `isEmpty()` first, before you take someone out

---

A common way to use a queue: keep taking from the front until the line is empty

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> jobs = new LinkedList<>();
        jobs.offer("Pick up Lance");
        jobs.offer("Visit Phil");
        jobs.offer("Meet Diaz");

        while (!jobs.isEmpty()) {
            System.out.println("Doing: " + jobs.poll());
        }
    }
}
```

Output

```text
Doing: Pick up Lance
Doing: Visit Phil
Doing: Meet Diaz
```

---

## Mission: Sunshine Autos

The garage at Sunshine Autos fixes cars in the order they arrive. All day, two things happen: a new car drives in, or a mechanic gets free and takes the next car

Everything that happens is in a `String[] events` array. A car name means that car drives in: print `Waiting: name (n in line)`, where n is the length of the line after it joined. The word `next` means a mechanic is free: take the first car from the line and print `Fixed: name`. If no car is waiting, print `No cars waiting`. At the end, print `Still waiting: ` and the number of cars left in the line

**Example**

```text
Waiting: Infernus (1 in line)
Waiting: Cheetah (2 in line)
Fixed: Infernus
Waiting: Stinger (2 in line)
Fixed: Cheetah
Fixed: Stinger
No cars waiting
Still waiting: 0
```

**Example**

```text
Waiting: Admiral (1 in line)
Waiting: Banshee (2 in line)
Waiting: PCJ 600 (3 in line)
Fixed: Admiral
Still waiting: 2
```
