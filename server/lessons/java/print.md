Welcome to **Java**. Java is one of the most widely used languages in the world, especially in big companies, banks, and Android apps. It has a reputation for being a bit more **strict** than Python, but don’t worry, we’ll get used to it together :)

The first thing we want to learn is how to display something on the screen. In Python we just wrote **print("hello")**. In Java, things are a tiny bit more ceremonial

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("hey, I like pizza");
    }
}
```

**Run** the code. You should see

```text
hey, I like pizza
```

What is all that boilerplate around our **System.out.println**? Don’t panic. Right now, we don’t need to fully understand it. Just know that **every Java program** needs this structure to work. Think of it as the **frame of a painting** — it’s always there, the actual code goes **inside**

The line that does the work is

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("hey, I like pizza");
    }
}
```

**System.out.println** is Java’s way of saying **print**. The **ln** at the end means **line**, so it prints and goes to a new line, just like **print()** in Python

Three things to notice

- The text goes **inside double quotes** **""**, just like in Python
- Every statement ends with a **semicolon** **;**. Forget it and Java will refuse to run
- The **{ }** braces define **blocks** of code. Where Python uses indentation, Java uses **{ }**

Try removing the **;** and run the code. Read the error :)

---

We can also do

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
        System.out.println("World");
        System.out.println("I have 2 dogs");
    }
}
```

Three lines, three messages. Each one ends with **;**

There is also **System.out.print** without **ln**. The difference: it does **NOT** go to a new line after printing

```java
public class Main {
    public static void main(String[] args) {
        System.out.print("Hello");
        System.out.print("World");
    }
}
```

Output

```text
HelloWorld
```

Notice that **Hello** and **World** are stuck together. Run it. Most of the time, you’ll want **println**, but it’s good to know both exist

---

## Mission: First Transmission

The station’s communication array just came online. Send out your very first message to confirm the link is active.

Write a single `System.out.println` inside `main` that displays the greeting below.

**Example**

Your program should print

```text
Hello, CyberStars!
```
