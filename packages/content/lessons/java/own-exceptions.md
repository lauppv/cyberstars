`IllegalArgumentException` fits many problems, but its name says little. When your program has its own kind of problem, you can make your **own exception**: a class that extends `Exception`

```java
class WrongCodeException extends Exception {
    WrongCodeException(String message) {
        super(message);
    }
}

public class Main {
    static void openSafe(String code) throws WrongCodeException {
        if (!code.equals("1986")) {
            throw new WrongCodeException("The safe stays shut");
        }
        System.out.println("Open");
    }

    public static void main(String[] args) {
        try {
            openSafe("0000");
        } catch (WrongCodeException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

Output

```text
The safe stays shut
```

Three things to see

1. `extends Exception` makes it a checked exception. Extend `RuntimeException` instead if you want it unchecked
2. `super(message)` hands the message to `Exception`, so `getMessage()` works
3. By Java's habit, the name ends with `Exception`

---

The name alone already helps. `catch (WrongCodeException e)` catches only this problem, and other exceptions go past it

---

An exception is an object, so it can carry more than a message. Give it fields with the details, and the code that catches it can use them

```java
class TooYoungException extends Exception {
    int age;

    TooYoungException(int age) {
        super("Too young: " + age);
        this.age = age;
    }
}

public class Main {
    static void enterClub(int age) throws TooYoungException {
        if (age < 18) {
            throw new TooYoungException(age);
        }
        System.out.println("Welcome");
    }

    public static void main(String[] args) {
        try {
            enterClub(15);
        } catch (TooYoungException e) {
            System.out.println(e.getMessage());
            System.out.println("Come back in " + (18 - e.age) + " years");
        }
    }
}
```

Output

```text
Too young: 15
Come back in 3 years
```

---

## Mission: Phil's Shop

Phil Cassidy sells crates of fireworks from his yard. Orders come in one after the other, and Phil can only sell what he has

Make an exception class `OutOfStockException` that extends `Exception`. It keeps how many crates are missing, and its message is `short by ` and that number

Write a method `sell(int stock, int amount)` that gives back the stock left after the sale. When the order is bigger than the stock, it throws an `OutOfStockException` instead and sells nothing

Phil's crates are in `int stock`, and the orders in an `int[] orders` array. For each order, call `sell`. If it works, print `Sold amount, stock left`. If it throws, print `Sorry, ` and the message. At the end, print `Stock left: ` and what Phil has

**Example**

```text
Sold 4, 6 left
Sorry, short by 2
Sold 6, 0 left
Sorry, short by 1
Stock left: 0
```

**Example**

```text
Stock left: 3
```
