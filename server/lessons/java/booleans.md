A **boolean** is a value that can only be **true** or **false**. We’ve already seen them inside **if** conditions. Java has its own type for them, called **boolean**

```java
public class Main {
    public static void main(String[] args) {
        boolean isOnline = true;
        boolean hasKey = false;
        System.out.println(isOnline);
        System.out.println(hasKey);
    }
}
```

**Important**: in Java, **true** and **false** are **lowercase**. Be careful not to capitalize them

Conditions like **age < 18** or **x == 5** also produce booleans

```java
public class Main {
    public static void main(String[] args) {
        int age = 20;
        System.out.println(age < 18);    // false
        System.out.println(age >= 18);   // true
    }
}
```

---

We can combine booleans with logical operators

- **&&** means **and** (both conditions must be true)
- **||** means **or** (at least one must be true)
- **!** means **not** (flips the value)

Imagine: in order to drive a car, you need to be **at least 18 years old AND have a license**

```java
public class Main {
    public static void main(String[] args) {
        int age = 20;
        boolean hasLicense = true;

        if (age >= 18 && hasLicense) {
            System.out.println("You can drive");
        } else {
            System.out.println("Sorry, no driving today");
        }
    }
}
```

Both conditions must be **true** for **&&** to be **true**. If even one is false, the whole thing is false

---

**||** (or) is more relaxed. Just **one** of the conditions being true is enough

```java
public class Main {
    public static void main(String[] args) {
        boolean isVIP = false;
        boolean hasInvitation = true;

        if (isVIP || hasInvitation) {
            System.out.println("Welcome to the club");
        } else {
            System.out.println("Access denied");
        }
    }
}
```

**isVIP** is false, **hasInvitation** is true, so the **or** is true and the person enters

---

**!** flips a boolean. **!true** becomes **false**, **!false** becomes **true**

```java
public class Main {
    public static void main(String[] args) {
        boolean isLoggedIn = false;
        if (!isLoggedIn) {
            System.out.println("Please log in first");
        }
    }
}
```

Reads almost like English: _if not logged in, log in_

---

Truth tables, just to have them in one place

```text
true  && true  = true
true  && false = false
false && true  = false
false && false = false

true  || true  = true
true  || false = true
false || true  = true
false || false = false

!true  = false
!false = true
```

---

## Mission: Station Access Gate

You are writing the access system for the station. A person can enter if they are an **employee AND it is a working day**, OR if they are a **guest WITH an invitation**.

Store in four `boolean` variables whether the person is an employee, whether today is a working day, whether they are a guest, and whether they have an invitation. Then write an `if / else` using `&&` and `||` that prints `Access granted` or `Access denied`.

**Example**

If the person is an employee and today is a working day (even if they are not a guest and have no invitation), your program should print

```text
Access granted
```
