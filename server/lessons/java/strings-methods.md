We already saw how to declare a **String** and combine strings with **+**. Time to look at the most useful **String methods** in Java

---

How long is a string? **.length()**

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name.length());
    }
}
```

Output **14**. Spaces count too. Notice the **parentheses** **()** at the end — for a String, **length** is a **method**, so we call it with parentheses

---

Uppercase and lowercase

```java
public class Main {
    public static void main(String[] args) {
        String name = "tommy vercetti";
        System.out.println(name.toUpperCase());   // TOMMY VERCETTI
        System.out.println(name.toLowerCase());   // tommy vercetti
    }
}
```

**Important**: these methods do **not** change the original variable. They give back a **new** string

```java
public class Main {
    public static void main(String[] args) {
        String name = "tommy";
        name.toUpperCase();
        System.out.println(name);   // still tommy
    }
}
```

To actually keep the uppercase version, we must **reassign**

```java
public class Main {
    public static void main(String[] args) {
        String name = "tommy";
        name = name.toUpperCase();
        System.out.println(name);   // TOMMY
    }
}
```

This trap catches everyone in the beginning. Strings in Java are **immutable** — they cannot be changed. Methods always return a new string

---

Get a **substring** (a piece of the string)

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name.substring(0, 5));   // Tommy
        System.out.println(name.substring(6));      // Vercetti
    }
}
```

**substring(start, end)** gives the characters from position **start** up to (but **not** including) position **end** — the end is exclusive

**substring(start)** with one argument gives everything from **start** to the end of the string

Counting starts from **0**. **name.substring(0, 5)** means positions **0, 1, 2, 3, 4** which spell **Tommy**

---

Single character at a position

```java
public class Main {
    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        System.out.println(name.charAt(0));   // T
        System.out.println(name.charAt(6));   // V
    }
}
```

**charAt(i)** gives back a **char** (a single character). Combined with **length()**, you can grab the last character too: **name.charAt(name.length() - 1)**

---

Comparing strings — and **the most common Java trap of all time**

```java
public class Main {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";

        if (a == b) {
            System.out.println("equal");
        } else {
            System.out.println("not equal");
        }
    }
}
```

This **might** print **equal**, but **it's wrong**. With objects (and **String** is an object in Java), **==** compares whether they are the **same object in memory**, not whether they have the same content. The correct way is

```java
public class Main {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";

        if (a.equals(b)) {
            System.out.println("equal");
        }
    }
}
```

**Always use .equals() to compare strings in Java**. Memorize this right now

---

## Mission: Signal Decoder

A garbled name arrived over Tommy's comms. The decryption module needs you to display it in several formats so the analysts can check it.

Store the name in a String. Then print these six values on **separate lines**, in this order:

- the name in uppercase
- the name in lowercase
- the length of the name
- the first character
- the first **5** characters
- the last **5** characters

For "the last 5 characters" use **length()** to compute the start position, so it works for any name (of at least 5 letters).

**Example** for the name `lance vance`:

```text
LANCE VANCE
lance vance
11
l
lance
vance
```

**Example** for the name `tommy vercetti`:

```text
TOMMY VERCETTI
tommy vercetti
14
t
tommy
cetti
```

**Example** for the name `lance` (exactly 5 letters — the first 5 and the last 5 are the whole name):

```text
LANCE
lance
5
l
lance
lance
```
