In real life we often face decisions: **if** it's cold, we put on a warm sweater, **otherwise** a t-shirt is enough

In code, we say

```java
public class Main {
    public static void main(String[] args) {
        int temperature = 10;
        if (temperature < 15) {
            System.out.println("put on a sweater");
        } else {
            System.out.println("a t-shirt is enough");
        }
    }
}
```

Two things to notice in Java

- The condition goes inside **parentheses** **( )**
- The block of code goes inside **braces** **{ }**

If the **temperature** is less than **15**, we enter the **if** block (it's cold, dress warm). **Otherwise**, we enter the **else** block. Run the code, change the temperature, see what happens

---

The comparison operators are exactly the ones you'd expect

- **<** less than
- **<=** less than or equal
- **>** greater than
- **>=** greater than or equal
- **==** equal (note the two equals signs)
- **!=** **not** equal

**Be careful** about the difference between **=** and **==**. **=** assigns a value, **==** compares

```java
public class Main {
    public static void main(String[] args) {
        int x = 4;
        if (x = 4) {       // error
            System.out.println("Boo");
        }
    }
}
```

This won't compile. Java won't even let you make this mistake. The correct version is

```java
public class Main {
    public static void main(String[] args) {
        int x = 4;
        if (x == 4) {
            System.out.println("Boo");
        }
    }
}
```

---

We don't always need an **else**. Sometimes we just want to do something **if** a condition is true, and otherwise do nothing

```java
public class Main {
    public static void main(String[] args) {
        boolean isUserOnline = true;
        if (isUserOnline) {
            System.out.println("Welcome back");
        }
    }
}
```

Notice we wrote **if (isUserOnline)** without **== true**. Both work, but the shorter form is what Java programmers typically write

---

A complete example

```java
public class Main {
    public static void main(String[] args) {
        String username = "Tommy Vercetti";
        boolean isUserOnline = true;

        if (isUserOnline) {
            System.out.println(username + " is playing GTA Vice City");
        } else {
            System.out.println(username + " is offline");
        }
    }
}
```

Change **isUserOnline** to **false** and run again. Read the new output. Programming becomes fun the moment you start **playing** with the values

---

## Mission: Hull Temperature Alert

The station's hull sensor reports the outside temperature.

Create an `int` variable named `temperature` (any value you like). Then write an **if / else** that checks it:

- if the temperature is **less than 0** → print `it's freezing outside`
- otherwise → print `water does not freeze`

**Example**

With a temperature of `-5`, your program should print

```text
it's freezing outside
```
