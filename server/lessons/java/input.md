So far, we’ve hardcoded all the values in our programs. Time to let the **user** type something. In Java, we read input through a tool called **Scanner**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("What's your name? ");
        String name = scanner.nextLine();

        System.out.println("Hello, " + name + "!");
    }
}
```

**Run** the code, type something, press **Enter**

Two new things appeared

- **import java.util.Scanner;** at the top, **before** the **public class**. This tells Java: "I want to use the Scanner tool from Java’s standard library"
- **Scanner scanner = new Scanner(System.in);** creates a new scanner that reads from **standard input** (the keyboard)

The actual reading happens with **scanner.nextLine()** — it waits for the user to type a line and press **Enter**, then gives back the typed text as a **String**

---

For numbers, **Scanner** has different methods

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Your age: ");
        int age = scanner.nextInt();

        System.out.println("Next year you will be " + (age + 1));
    }
}
```

**scanner.nextInt()** reads a whole number directly and hands it to us as an **int**, with no conversion needed on our side

For decimal numbers, there’s **scanner.nextDouble()**

```java
public class Main {
    public static void main(String[] args) {
        double height = scanner.nextDouble();
    }
}
```

---

A small **gotcha** that catches everyone. If you mix **nextInt()** and **nextLine()**, things get weird

```java
public class Main {
    public static void main(String[] args) {
        int age = scanner.nextInt();
        String name = scanner.nextLine();   // this looks empty!
    }
}
```

**Why?** Because **nextInt()** reads the number but leaves the **newline character** behind. Then **nextLine()** picks up that empty newline and immediately returns an empty string

The fix: add an extra **scanner.nextLine()** to "eat" the leftover newline

```java
public class Main {
    public static void main(String[] args) {
        int age = scanner.nextInt();
        scanner.nextLine();   // consume the leftover newline
        String name = scanner.nextLine();
    }
}
```

Annoying, but you only need to remember it once

To keep things simple in this exercise, we’ll **read the name first**, then the age

---

## Mission: Crew Check-In

Every crew member arriving at the station must scan in at the terminal. The system reads their name and age, then prints a welcome line.

Create a **Scanner**, read the name first (first line), then the age (second line). Then build and print the welcome message using **+**.

**Input** (typed by the user when the program runs):

- First line — crew member's name
- Second line — crew member's age

**Example**

If the user types

```text
Cortez
60
```

your program should print

```text
Hello Cortez, you are 60 years old. Next year you will be 61
```
