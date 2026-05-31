In real life we often face decisions: **if** it’s cold, take a sweater, **otherwise** a t-shirt is enough. **If** I’m sleepy, I go to sleep, **otherwise** I program :)

In code, we say

```java
public class Main {
    public static void main(String[] args) {
        int age = 18;
        if (age < 18) {
            System.out.println("Access denied because you are not 18 years old");
        } else {
            System.out.println("Welcome to the club");
        }
    }
}
```

Three things to notice in Java

- The condition goes inside **parentheses** **( )**
- The block of code goes inside **braces** **{ }**
- We don’t need a **:** like in Python

If the **age** is less than **18**, we enter the **if** block. **Otherwise**, we enter the **else** block. Run the code, change the age, see what happens

---

The comparison operators are exactly the ones you’d expect

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
        if (x = 4) {       // ERROR
            System.out.println("Boo");
        }
    }
}
```

This won’t compile. Java won’t even let you make this mistake (unlike some other languages). The correct version is

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

We don’t always need an **else**. Sometimes we just want to do something **if** a condition is true, and otherwise do nothing

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

Change **isUserOnline** to **false** and run again. Read the new output. Programming becomes fun the moment you start **playing** with the values :)

---

## Mission: Hull Temperature Alert

The station's hull sensor reports the outside temperature. Write an **if / else** that checks it:

- if `temperature` is **less than 0** → print `it's freezing outside`
- otherwise → print `water does not freeze`

**Input** (already set at the top of your code — change the values to test):

- `temperature` — hull temperature in degrees Celsius (int)

**Example**

With `temperature = -5`, your program should print

```text
it's freezing outside
```
