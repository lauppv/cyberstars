A queue serves people in the order they came. But at a hospital, the worst case goes first, even if it came last. That is a **PriorityQueue**: `poll()` always gives you the smallest item, not the oldest one

```java
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> numbers = new PriorityQueue<>();
        numbers.offer(40);
        numbers.offer(5);
        numbers.offer(17);

        System.out.println(numbers.poll());
        System.out.println(numbers.poll());
        System.out.println(numbers.poll());
    }
}
```

Output

```text
5
17
40
```

It has the same methods as a queue: `offer`, `poll`, `peek`, `isEmpty`, `size`. Only the order is different. Strings come out in alphabetical order

---

One surprise: if you print the whole PriorityQueue, it is not sorted. Inside, the queue only makes sure the smallest is in front. The rest is kept in a loose order. If you want them in order, take them out one by one with `poll()`

```java
import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> numbers = new PriorityQueue<>();
        numbers.offer(3);
        numbers.offer(9);
        numbers.offer(1);
        numbers.offer(8);

        System.out.println(numbers);
        while (!numbers.isEmpty()) {
            System.out.println(numbers.poll());
        }
    }
}
```

Output

```text
[1, 8, 3, 9]
1
3
8
9
```

---

What about your own objects? The PriorityQueue has to know which one is "smaller". Just like `Collections.sort`, it uses `compareTo` from the **Comparable** interface

```java
import java.util.PriorityQueue;

class Patient implements Comparable<Patient> {
    String name;
    int pain;

    Patient(String name, int pain) {
        this.name = name;
        this.pain = pain;
    }

    public int compareTo(Patient other) {
        return other.pain - this.pain;
    }
}

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Patient> room = new PriorityQueue<>();
        room.offer(new Patient("Phil", 4));
        room.offer(new Patient("Lance", 9));
        room.offer(new Patient("Kent", 6));

        while (!room.isEmpty()) {
            Patient p = room.poll();
            System.out.println(p.name + " (pain " + p.pain + ")");
        }
    }
}
```

Output

```text
Lance (pain 9)
Kent (pain 6)
Phil (pain 4)
```

`other.pain - this.pain` makes the biggest pain the "smallest" item, so it goes first

---

## Mission: Most Urgent First

Tommy has a list of jobs for the night. Each job has an urgency number: 1 means "do it now", bigger numbers can wait. Tommy wants to do them from the most urgent to the least urgent

The jobs are in a `String[] jobs` array and their urgency in an `int[] urgency` array. `jobs[i]` has urgency `urgency[i]`. Put every job in a PriorityQueue and take them out one by one. Print each as `urgency - job`. When two jobs have the same urgency, the one whose name comes first in alphabetical order goes first

**Example**

```text
1 - Pay the cops
2 - Meet Diaz
2 - Pick up Lance
5 - Buy a boat
```

**Example**

```text
3 - Call Kent
```
