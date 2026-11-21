So far, Java threw the exceptions: dividing by zero, a bad index, text that is not a number. Your own code can throw one too, with **throw**. You do it when something is wrong and the method can't go on

```java
public class Main {
    static int split(int cash, int people) {
        if (people <= 0) {
            throw new IllegalArgumentException("Nobody to split with");
        }
        return cash / people;
    }

    public static void main(String[] args) {
        System.out.println(split(900, 3));
        System.out.println(split(900, 0));
        System.out.println("Done");
    }
}
```

Output

```text
300
```

Then the program stops with `IllegalArgumentException: Nobody to split with`. "Done" never prints. `throw` ends the method right there, like a `return`, but with an error

---

`new IllegalArgumentException("...")` makes an exception object with a message. Java has many ready-made ones. Two that fit most cases

- `IllegalArgumentException`: the method got a value it can't work with
- `IllegalStateException`: the object is not in the right state for this call

---

Whoever calls the method can catch the exception, like you did before with `try` and `catch`. `getMessage()` gives back the text you wrote

```java
public class Main {
    static int split(int cash, int people) {
        if (people <= 0) {
            throw new IllegalArgumentException("Nobody to split with");
        }
        return cash / people;
    }

    public static void main(String[] args) {
        int[] crews = {3, 0, 2};
        for (int people : crews) {
            try {
                System.out.println("Each gets " + split(900, people));
            } catch (IllegalArgumentException e) {
                System.out.println("Problem: " + e.getMessage());
            }
        }
    }
}
```

Output

```text
Each gets 300
Problem: Nobody to split with
Each gets 450
```

The method finds the problem. The caller decides what to do about it

---

A method can also say in its first line which exceptions it may throw, with **throws**

```text
static int split(int cash, int people) throws IllegalArgumentException {
```

For `IllegalArgumentException` this is only a note for the reader. In the next lesson you will meet exceptions where Java makes `throws` a must

```java
public class Main {
    static void checkAge(int age) throws IllegalArgumentException {
        if (age < 18) {
            throw new IllegalArgumentException("Too young for the club: " + age);
        }
        System.out.println("Come in");
    }

    public static void main(String[] args) {
        try {
            checkAge(25);
            checkAge(16);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

Output

```text
Come in
Too young for the club: 16
```

---

## Mission: The Bank Job

Tommy has an account at a bank in Vice City, and he sends a list of withdrawals. The bank pays out only what makes sense

Write a method `withdraw(int balance, int amount)` that gives back the new balance. It throws an `IllegalArgumentException` with the message `Amount must be positive` when the amount is 0 or less, and with `Not enough money` when the amount is bigger than the balance

The money starts in `int balance`, and the withdrawals are in an `int[] withdrawals` array. For each one, call `withdraw`. If it works, print `Took amount, left balance`. If it throws, print `Refused: ` and the message. At the end, print `Balance: ` and what is left

**Example**

```text
Took 300, left 700
Refused: Not enough money
Refused: Amount must be positive
Took 700, left 0
Balance: 0
```

**Example**

```text
Balance: 50
```
