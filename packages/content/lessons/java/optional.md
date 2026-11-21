Sometimes a method has nothing to give back. You look for a contact, and there is none. Many methods give back `null` then, and if you forget to check it, your program crashes with a `NullPointerException`

An **Optional** is a box that holds one value, or nothing. Its type says out loud: "there may be nothing here, check first"

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> full = Optional.of("Lance");
        Optional<String> empty = Optional.empty();

        System.out.println(full.isPresent());
        System.out.println(empty.isPresent());
        System.out.println(full.get());
    }
}
```

Output

```text
true
false
Lance
```

`get()` gives you the value inside. But on an empty Optional it crashes, so only call it after you checked

---

The safer way: `orElse` gives the value, or a backup value when the box is empty

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> driver = Optional.empty();
        System.out.println("Driver: " + driver.orElse("nobody"));

        Optional<String> boss = Optional.of("Tommy");
        System.out.println("Boss: " + boss.orElse("nobody"));
    }
}
```

Output

```text
Driver: nobody
Boss: Tommy
```

Two more helpers

- `ifPresent(action)`: runs the lambda only when there is a value
- `map(change)`: changes the value inside, and keeps an empty box empty

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("phil");
        Optional<String> nothing = Optional.empty();

        name.ifPresent(n -> System.out.println("Found " + n));
        System.out.println(name.map(n -> n.toUpperCase()).orElse("-"));
        System.out.println(nothing.map(n -> n.toUpperCase()).orElse("-"));
    }
}
```

Output

```text
Found phil
PHIL
-
```

`Optional.ofNullable(x)` makes an empty box when `x` is null, and a full box otherwise. It's handy for values that may be null

---

Streams give you Optionals too. `findFirst()` gives the first item that is left, and `max(comparator)` the biggest one. The stream may be empty, so both give back an Optional

```java
import java.util.ArrayList;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> contacts = new ArrayList<>();
        contacts.add("Kent Paul");
        contacts.add("Ken Rosenberg");
        contacts.add("Lance Vance");

        Optional<String> first = contacts.stream()
            .filter(c -> c.startsWith("Ken"))
            .findFirst();
        Optional<String> longest = contacts.stream()
            .max((a, b) -> a.length() - b.length());

        System.out.println(first.orElse("no one"));
        System.out.println(longest.orElse("no one"));
    }
}
```

Output

```text
Kent Paul
Ken Rosenberg
```

"Kent Paul" starts with "Ken" too, and it comes first in the list

---

## Mission: Speed Dial

Tommy's phone has a short list of contacts. He types the start of a name, and the phone should show the first contact that starts with what he typed

The contacts are in a `String[] contacts` array, in the order they are saved. What Tommy types is in a `String[] searches` array. For each search, find the first contact that starts with it and print `search: contact`. If no contact starts with it, print `search: no one`. Use a stream that gives back an Optional

**Example**

```text
Ken: Kent Paul
Lan: Lance Vance
Son: no one
Ken R: Ken Rosenberg
```

**Example**

```text
T: no one
```
