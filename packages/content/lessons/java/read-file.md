You can write files now. Reading them back is the other half. The quickest way is `Files.readAllLines`: it gives you every line of the file in a List

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("cars.txt"))) {
            out.println("Infernus");
            out.println("Cheetah");
        }

        List<String> lines = Files.readAllLines(Path.of("cars.txt"));
        System.out.println(lines.size() + " cars");
        for (String line : lines) {
            System.out.println("- " + line);
        }
    }
}
```

Output

```text
2 cars
- Infernus
- Cheetah
```

---

`readAllLines` loads the whole file at once. That's fine for small files. For a big file, read it one line at a time with a **BufferedReader**. `readLine()` gives the next line, or `null` when the file is over

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("calls.txt"))) {
            out.println("Lance");
            out.println("Kent");
            out.println("Phil");
        }

        try (BufferedReader in = new BufferedReader(new FileReader("calls.txt"))) {
            String line = in.readLine();
            while (line != null) {
                System.out.println("Call " + line);
                line = in.readLine();
            }
        }
    }
}
```

Output

```text
Call Lance
Call Kent
Call Phil
```

It mirrors writing: `FileReader` opens the file, `BufferedReader` wraps it so you can read whole lines, and try-with-resources closes it

---

Files often keep several values on one line, with a comma between them. Read the line, then cut it with `split`

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("prices.txt"))) {
            out.println("Infernus,150000");
            out.println("Admiral,25000");
        }

        int total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("prices.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] parts = line.split(",");
                total += Integer.parseInt(parts[1]);
            }
        }
        System.out.println("Total: " + total);
    }
}
```

Output

```text
Total: 175000
```

`while ((line = in.readLine()) != null)` reads a line and checks it in one go. You will see this shape a lot

---

What if the file isn't there? Reading throws an `IOException`. For a missing file it's a more exact kind: `FileNotFoundException` from `FileReader`, or `NoSuchFileException` from `Files`

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        try {
            Files.readAllLines(Path.of("secret-plans.txt"));
        } catch (IOException e) {
            System.out.println("No file to read");
        }
    }
}
```

Output

```text
No file to read
```

---

## Mission: The Crew File

Cortez keeps his crew's record in a file. Each line has a name and how many missions that person did, with a comma between them, like `Lance,12`

The lines are in a `String[] lines` array. First, write them to the file `crew.txt`, one per line. Then read the file back line by line with a BufferedReader. For each line, print `name: missions missions`. At the end, print `Total: ` with all the missions together, and `Most: ` with the name of the person who did the most. If several did the most, pick the first one in the file. There is always at least one line

**Example**

```text
Tommy: 47 missions
Lance: 12 missions
Mercedes: 23 missions
Total: 82
Most: Tommy
```

**Example**

```text
Phil: 8 missions
Total: 8
Most: Phil
```
