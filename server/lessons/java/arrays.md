So far, every variable held **one** thing. But what if we want to store **all** the GTA Vice City characters? Writing **name1**, **name2**, **name3**... is ugly. We need an **array**

An **array** is a collection of values of the **same type**, stored in a single variable

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy" };

        System.out.println(names[0]);
        System.out.println(names[1]);
        System.out.println(names[2]);
    }
}
```

Output

```text
Tommy Vercetti
Lance Vance
Cortez
```

Two new things

- The type is **String[]** (notice the **[]**) — "an array of Strings"
- We use **{ }** to list the values, separated by commas

Just like in Python, **counting starts from 0**. **names[0]** is the first element, **names[1]** the second, and so on

---

Java arrays have a **fixed size**. Once you create them, you can’t add or remove elements. (For dynamic collections, Java has **ArrayList**, but we’ll keep arrays for now)

How many elements does the array have? Use **.length**

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        System.out.println(names.length);   // 3
    }
}
```

**Notice**: **names.length** has **no parentheses**, unlike **String.length()**. Yes, this is annoyingly inconsistent — arrays use a **field** called **length**, while Strings have a **method** called **length()**. Welcome to Java :)

---

We can also create an array with a fixed size, then fill it later

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = new int[5];   // an array of 5 ints, all zero by default
        scores[0] = 80;
        scores[1] = 95;
        scores[2] = 60;
        scores[3] = 72;
        scores[4] = 88;
        System.out.println(scores[2]);   // 60
    }
}
```

**new int[5]** creates an array with **5** slots. By default they are filled with **0** for numbers, **null** for objects (like Strings), and **false** for booleans

---

We can **change** a value at any index

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        names[1] = "Lance Vance Dance";
        System.out.println(names[1]);   // Lance Vance Dance
    }
}
```

---

What happens if we ask for an index that doesn’t exist?

```java
public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Cortez" };
        System.out.println(names[10]);
    }
}
```

Run it. Java throws an **ArrayIndexOutOfBoundsException** and crashes. Read the error :)

---

You have an array **heroes** declared on the right with **3 slots**, all empty for now. Do the following

1. Set **heroes[0]** to **"Shrek"**
2. Set **heroes[1]** to **"Fiona"**
3. Set **heroes[2]** to **"Donkey"**
4. Display the **length** of the array
5. Display the **first** hero
6. Display the **last** hero

Expected output

```text
3
Shrek
Donkey
```
