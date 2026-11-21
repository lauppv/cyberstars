Java has two families of exceptions, and it treats them very differently

- **Unchecked** exceptions are bugs or bad values: `ArithmeticException`, `NullPointerException`, `IllegalArgumentException`, `NumberFormatException`. They all come from `RuntimeException`. Java lets you catch them, but doesn't force you
- **Checked** exceptions are problems outside your code that can happen even when your code is right: a file that is missing, a network that is down. They come from `Exception`, but not from `RuntimeException`. Java forces you to deal with them

---

Throw a checked exception and forget about it, and the program doesn't even compile

```java
public class Main {
    static void openSafe(String code) {
        if (!code.equals("1986")) {
            throw new Exception("Wrong code");
        }
        System.out.println("Open");
    }

    public static void main(String[] args) {
        openSafe("1234");
    }
}
```

This doesn't compile. Java says: `unreported exception Exception; must be caught or declared to be thrown`

---

So you have two choices. Either catch it right there, or write `throws Exception` on the method and let the caller handle it. Then the caller has the same two choices

```java
public class Main {
    static void openSafe(String code) throws Exception {
        if (!code.equals("1986")) {
            throw new Exception("Wrong code");
        }
        System.out.println("Open");
    }

    public static void main(String[] args) {
        try {
            openSafe("1986");
            openSafe("1234");
        } catch (Exception e) {
            System.out.println("Alarm: " + e.getMessage());
        }
    }
}
```

Output

```text
Open
Alarm: Wrong code
```

With `throws Exception`, everyone who calls `openSafe` sees that it can fail, and Java checks they don't forget it. That's why these are called checked

---

When you catch several exceptions, put the specific ones first. `NumberFormatException` is a kind of `Exception`, so if `catch (Exception e)` came first, it would catch everything and the second catch could never run. Java doesn't even compile that

```java
public class Main {
    static int readCode(String text) throws Exception {
        if (text.isEmpty()) {
            throw new Exception("Empty code");
        }
        return Integer.parseInt(text);
    }

    public static void main(String[] args) {
        String[] tries = {"42", "abc", ""};
        for (String t : tries) {
            try {
                System.out.println("Code " + readCode(t));
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + t);
            } catch (Exception e) {
                System.out.println("Problem: " + e.getMessage());
            }
        }
    }
}
```

Output

```text
Code 42
Not a number: abc
Problem: Empty code
```

`parseInt` throws an unchecked `NumberFormatException`. Our own `throw` makes a checked `Exception`. Each one lands in its own catch

---

Which one should you throw? A simple rule

- The caller made a mistake (a bad value)? Unchecked, like `IllegalArgumentException`
- Something outside can go wrong, and the caller should plan for it? Checked

---

## Mission: The Safe Combination

Tommy is trying codes on a safe in the back of the Pole Position club. A good code has exactly 4 characters, and all of them are digits

Write a method `checkCode(String code)` that throws a checked `Exception` with the message `needs 4 characters` when the code is not 4 characters long. Otherwise it turns the code into a number with `Integer.parseInt`, which throws a `NumberFormatException` when there are letters in it

The codes are in a `String[] codes` array. For each one, call `checkCode`. If it works, print `Code ok: code`. If the code has letters, print `Not a number: code`. If it has the wrong length, print `Bad code: ` and the message. At the end, print `Good codes: ` and how many codes worked

**Example**

```text
Code ok: 1986
Bad code: needs 4 characters
Not a number: 19x6
Code ok: 0042
Good codes: 2
```

**Example**

```text
Bad code: needs 4 characters
Good codes: 0
```
