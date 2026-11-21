Data often comes as one long line of text: names with commas between them, or a record like `Tommy:120`. **split** cuts such a line into pieces and gives them back as a String array

---

You tell `split` what separates the pieces

```java
public class Main {
    public static void main(String[] args) {
        String crew = "Tommy,Lance,Ken";
        String[] names = crew.split(",");
        System.out.println(names.length);
        for (String name : names) {
            System.out.println(name);
        }
    }
}
```

Output

```text
3
Tommy
Lance
Ken
```

The commas are gone. They only marked where to cut

---

Text often has extra spaces around the pieces. **trim** removes spaces at the start and the end of a String

```java
public class Main {
    public static void main(String[] args) {
        String line = "Tommy,  Lance ,Ken";
        String[] parts = line.split(",");
        for (String part : parts) {
            System.out.println("[" + part.trim() + "]");
        }
    }
}
```

Output

```text
[Tommy]
[Lance]
[Ken]
```

---

The pieces are Strings, even when they hold numbers. To do math with them, turn them into numbers with `Integer.parseInt`, like you did when reading input

```java
public class Main {
    public static void main(String[] args) {
        String scores = "12 7 30";
        String[] parts = scores.split(" ");
        int total = 0;
        for (String part : parts) {
            total += Integer.parseInt(part);
        }
        System.out.println("Total: " + total);
    }
}
```

Output

```text
Total: 49
```

---

You can split in two steps. First cut the line into records, then cut each record into its fields

```java
public class Main {
    public static void main(String[] args) {
        String garage = "Infernus:240;Cheetah:230";
        for (String car : garage.split(";")) {
            String[] fields = car.split(":");
            System.out.println(fields[0] + " goes " + fields[1]);
        }
    }
}
```

Output

```text
Infernus goes 240
Cheetah goes 230
```

---

One trap: a few characters have a special meaning for split, like the dot and `|`. To split on a dot, write `"\\."`, not `"."`. Commas, spaces, colons and semicolons are safe

---

## Mission: Score Sheet

After a race, the results arrive as one line of text, like `Tommy:120;Lance:85;Ken:40`. Records are separated by `;`, and each record is a name and a score separated by `:`. Store the line in a `String` named `results`.

Print each racer as `name - score`, in the order they came. Then print `Total: N` with the sum of the scores and `Best: name` with the racer who has the highest score. If two racers share the highest score, the first one wins.

**Example** for `results = "Tommy:120;Lance:85;Ken:40"`

```text
Tommy - 120
Lance - 85
Ken - 40
Total: 245
Best: Tommy
```

**Example** for `results = "Sonny:10;Diaz:55;Avery:55"`

```text
Sonny - 10
Diaz - 55
Avery - 55
Total: 120
Best: Diaz
```

**Example** for `results = "Phil:7"`

```text
Phil - 7
Total: 7
Best: Phil
```
