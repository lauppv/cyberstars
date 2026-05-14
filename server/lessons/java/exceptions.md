In Python, when something goes wrong, you get an exception and the program crashes. Same in Java — but Java gives you **try/catch** to handle it gracefully

```java
public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Can't divide by zero!");
        }
        System.out.println("Program continues...");
    }
}
```
Output
```text
Can't divide by zero!
Program continues...
```

Without try/catch, the program would crash at `10 / 0`. With it, Java **catches** the error, runs your catch block, and keeps going. Python's equivalent is `try/except` — same concept, different keywords

---

The basic structure

```java
try {
    // code that might fail
} catch (SomeException e) {
    // what to do if it fails
}
```

The `e` is the exception object. You can call `e.getMessage()` to get a human-readable description of what went wrong

```java
try {
    int[] nums = {1, 2, 3};
    System.out.println(nums[10]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Error: " + e.getMessage());
}
```
Output
```text
Error: Index 10 out of bounds for length 3
```

---

Different errors throw different exception types. Here are the most common ones

- **ArithmeticException** — dividing by zero
- **ArrayIndexOutOfBoundsException** — accessing an array index that doesn't exist
- **NumberFormatException** — trying to parse a string that isn't a valid number
- **NullPointerException** — using a variable that's null (the infamous NPE)
- **ClassCastException** — invalid object casting

You can catch a general `Exception` to catch everything, but it's better to be specific. It's like Tommy Vercetti doing a mission — you want to plan for SPECIFIC things going wrong, not just a vague "something bad might happen"

---

You can have **multiple catch blocks** for different exception types

```java
try {
    String text = "hello";
    int num = Integer.parseInt(text);
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} catch (Exception e) {
    System.out.println("Something else went wrong: " + e.getMessage());
}
```

Java tries each catch block from top to bottom and uses the **first one that matches**. Put specific exceptions BEFORE general ones

---

The **finally** block runs NO MATTER WHAT — whether the try succeeded or an exception was caught

```java
try {
    System.out.println("Trying...");
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Caught error!");
} finally {
    System.out.println("This ALWAYS runs");
}
```
Output
```text
Trying...
Caught error!
This ALWAYS runs
```

Finally is useful for cleanup — closing files, releasing resources, etc. Even if the world is ending (exception thrown), the finally block still runs. Like how in Vice City, the police always show up eventually, no matter what

---

**When to catch vs when to fix?**

Don't use try/catch as a crutch. If you know an array has 3 elements, don't access index 10 and catch the error — just check the index first. Use try/catch for things you genuinely can't predict: user input, file reading, network calls

Bad:
```java
try {
    System.out.println(arr[index]);
} catch (ArrayIndexOutOfBoundsException e) { }
```

Good:
```java
if (index >= 0 && index < arr.length) {
    System.out.println(arr[index]);
}
```

---

Parsing strings to numbers is a classic use case for try/catch, because you can't always control what string you receive

```java
public class Main {
    public static void main(String[] args) {
        try {
            int num = Integer.parseInt("hello");
        } catch (NumberFormatException e) {
            System.out.println("Not a valid number: hello");
        }

        try {
            int num = Integer.parseInt("42");
            System.out.println("Parsed: " + num);
        } catch (NumberFormatException e) {
            System.out.println("Not a valid number");
        }
    }
}
```
Output
```text
Not a valid number: hello
Parsed: 42
```

---

Your turn! Write code that tries to parse the string "hello" as an integer using `Integer.parseInt()`. Catch the `NumberFormatException` and print "Not a valid number: hello". Then try to parse "42" — this one should succeed. Print "Parsed: 42"
