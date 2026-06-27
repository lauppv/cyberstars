Welcome to **Java**. Java is one of the most widely used languages in the world, especially in big companies, banks, and Android apps. It has a reputation for being a **strict** and organized language, but don’t worry, we’ll get used to it together

The first thing we want to learn is how to display something on the screen

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

```text
System.out.println("hey, I like pizza");
```

**System.out.println** is how Java displays text on the screen. The **ln** at the end means **line**, so it prints and then goes to a new line

Three things to notice

- The text goes **inside double quotes** **""**
- Every statement ends with a **semicolon** **;**. Forget it and Java will refuse to run
- The **{ }** braces define **blocks** of code — they group the lines that belong together

Try removing the **;** and run the code. Read the error — that’s how you learn to recognize the compiler’s messages

---

We can print several lines, one after another

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

Notice that **Hello** and **World** are stuck together, because **print** does not add a new line between them. Most of the time, you’ll want **println**, but it’s good to know both exist

---

## Mission: First Transmission

The station’s communication array just came online. Send out your very first status report to confirm the link is active.

Write four `System.out.println` statements inside `main` that display **exactly** these four lines:

```text
Cyberstars Station
Antenna: active
Signal: stable
Hello from orbit, cadet!
```

Match the text exactly, line by line. Don’t forget the **quotes** and the **;** at the end.
