A queue serves the first one that came. A **stack** does the opposite: the last one in is the first one out. Think of crates in the back of a truck. You can only take the crate on top, the one you put there last

In Java, you build a stack with **ArrayDeque**

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> crates = new ArrayDeque<>();
        crates.push("Guns");
        crates.push("Cash");
        crates.push("Cigars");

        System.out.println(crates.pop());
        System.out.println(crates.pop());
        System.out.println(crates);
    }
}
```

Output

```text
Cigars
Cash
[Guns]
```

Cigars went in last, so they come out first. `Deque` (say "deck") is a line you can use from both ends. Here we use only one end, the top, and that makes it a stack

---

The stack methods

- `push(x)`: puts x on top
- `pop()`: takes the top one off and gives it back
- `peek()`: looks at the top one, but leaves it there
- `isEmpty()` and `size()`

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<Integer> plates = new ArrayDeque<>();
        plates.push(1);
        plates.push(2);
        plates.push(3);

        System.out.println("Top: " + plates.peek());
        System.out.println(plates);
        System.out.println("Size: " + plates.size());
    }
}
```

Output

```text
Top: 3
[3, 2, 1]
Size: 3
```

When you print a stack, the top comes first

---

Be careful: `pop()` on an empty stack crashes the program with a `NoSuchElementException`. Check `isEmpty()` first

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> notes = new ArrayDeque<>();
        if (notes.isEmpty()) {
            System.out.println("Nothing to take");
        } else {
            System.out.println(notes.pop());
        }
    }
}
```

Output

```text
Nothing to take
```

---

Stacks are everywhere. The Undo button is one: every change goes on top, and Undo takes back the last one

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> changes = new ArrayDeque<>();
        changes.push("paint the car pink");
        changes.push("add a spoiler");
        changes.push("remove the doors");

        System.out.println("Undo: " + changes.pop());
        System.out.println("Undo: " + changes.pop());
        System.out.println("Last change kept: " + changes.peek());
    }
}
```

Output

```text
Undo: remove the doors
Undo: add a spoiler
Last change kept: paint the car pink
```

---

## Mission: The Way Back

Tommy drives around Vice City and keeps a list of the places he went. When things get hot, he wants to drive back the way he came, one place at a time

Everything he does is in a `String[] moves` array. A place name means he drives there: print `Drive to place`. The word `back` means he goes back to the place he was before: print `Back at place`. If there is no place before the one he is at, print `Nowhere to go back to`. At the end, print `Now at: place`, or `Now at: nowhere` if he never went anywhere

**Example**

```text
Drive to Ocean Beach
Drive to Little Havana
Drive to Downtown
Back at Little Havana
Back at Ocean Beach
Nowhere to go back to
Now at: Ocean Beach
```

**Example**

```text
Drive to Starfish Island
Drive to Vice Point
Back at Starfish Island
Drive to Prawn Island
Now at: Prawn Island
```
