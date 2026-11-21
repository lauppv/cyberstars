Everything your program printed so far was gone the moment it ended. To keep it, write it to a **file**. Java's easiest tool for that is **PrintWriter**: it has the same `println` you already know, but it writes to a file

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("crew.txt"))) {
            out.println("Tommy");
            out.println("Lance");
        }

        System.out.print(Files.readString(Path.of("crew.txt")));
    }
}
```

Output

```text
Tommy
Lance
```

Step by step

1. `new FileWriter("crew.txt")` opens the file for writing. If it doesn't exist, Java makes it
2. `new PrintWriter(...)` wraps it, so you can use `println`
3. The `try (...)` closes the file at the end. Only then is everything really saved on the disk
4. `Files.readString(Path.of("crew.txt"))` reads the whole file back as one String, so we can check what is in it

---

Working with files can fail for reasons outside your code: the disk is full, you are not allowed to write there. So file methods throw `IOException`, a checked exception. You must catch it, or add `throws IOException` to the method, like we did on `main`

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) {
        try (PrintWriter out = new PrintWriter(new FileWriter("/no/such/folder/log.txt"))) {
            out.println("hello");
        } catch (IOException e) {
            System.out.println("Could not write the file");
        }
    }
}
```

Output

```text
Could not write the file
```

---

Careful: `new FileWriter("crew.txt")` empties the file first. Everything that was in it is gone. To add to the end instead, pass `true` as a second value: that is **append** mode

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("log.txt"))) {
            out.println("Monday: quiet");
        }
        try (PrintWriter out = new PrintWriter(new FileWriter("log.txt", true))) {
            out.println("Tuesday: busy");
        }

        System.out.print(Files.readString(Path.of("log.txt")));
    }
}
```

Output

```text
Monday: quiet
Tuesday: busy
```

Without `true`, only "Tuesday: busy" would be left

---

## Mission: The Ledger

Tommy keeps a ledger of what his businesses earn each day, and he wants it in a file, not on paper

The days are in a `String[] days` array and the earnings in an `int[] earnings` array. `days[i]` brought in `earnings[i]`. Write one line per day to the file `ledger.txt`, as `day: amount`, starting from an empty file. Then open the file again in append mode and add a last line `Total: ` with the sum of all the earnings. Finally, read the whole file and print it

**Example**

```text
Monday: 1200
Tuesday: 800
Wednesday: 2500
Total: 4500
```

**Example**

```text
Total: 0
```
