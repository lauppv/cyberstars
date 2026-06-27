When something goes wrong at runtime — division by zero, accessing a non-existent index, parsing invalid text — Java throws an **exception** and the program crashes. **try/catch** lets you catch the error and keep going

```java
public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero!");
        }
        System.out.println("Program continues...");
    }
}
```

Output

```text
Cannot divide by zero!
Program continues...
```

Without try/catch, the program would stop at `10 / 0`. With it, Java **catches** the error, runs the catch block, and moves on

---

Basic structure

```java
public class Main {
    public static void main(String[] args) {
        try {
            // code that might fail
        } catch (ExceptionType e) {
            // what to do if it fails
        }
    }
}
```

`e` is the exception object. You can call `e.getMessage()` to get a description of what went wrong

```java
public class Main {
    public static void main(String[] args) {
        try {
            int[] numbers = {1, 2, 3};
            System.out.println(numbers[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

Output

```text
Error: Index 10 out of bounds for length 3
```

---

Most common exception types

- **ArithmeticException** — division by zero
- **ArrayIndexOutOfBoundsException** — non-existent array index
- **NumberFormatException** — parsing a string that isn't a valid number
- **NullPointerException** — using a variable that is null
- **ClassCastException** — invalid object conversion

You can catch a general `Exception`, but it's better to be specific — handle each situation differently

---

You can have **multiple catch blocks**

```java
public class Main {
    public static void main(String[] args) {
        try {
            String text = "hello";
            int number = Integer.parseInt(text);
        } catch (NumberFormatException e) {
            System.out.println("Not a number: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Something else went wrong: " + e.getMessage());
        }
    }
}
```

Java tries each catch from top to bottom and uses the **first one that matches**. Put specific exceptions before general ones

---

The **finally** block runs no matter what — whether try succeeded or an exception was caught

```java
public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Trying...");
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Error caught!");
        } finally {
            System.out.println("This always runs");
        }
    }
}
```

Output

```text
Trying...
Error caught!
This always runs
```

Useful for cleanup — closing files, releasing resources

---

**When try/catch vs direct check?**

Don't use try/catch as a crutch. If you know an array has 3 elements, don't access index 10 — just check first. Use try/catch for things you can't predict: user input, text parsing

---

## Mission: Vice City Payments

Tommy receives payments from his businesses, but some reports come corrupted. Phil sends `"7500"`, Lance sends `"dunno"`, Mercedes sends `"23000"`, and Cortez sends `"error"`. Tommy needs to parse each amount and handle the invalid reports

Loop through the list of reports, try to parse each one as a number with `Integer.parseInt()`. If it works, print the payment. If not, catch the exception and print what went wrong

**Example**

```text
Payment: 7500
Invalid report: dunno
Payment: 23000
Invalid report: error
```
