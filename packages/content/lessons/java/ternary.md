Often an if/else only picks one of two values. Java has a short way to write that: the **ternary operator**, `condition ? valueIfTrue : valueIfFalse`

---

Here is the same choice written both ways

```java
public class Main {
    public static void main(String[] args) {
        int cash = 120;

        String plan;
        if (cash >= 100) {
            plan = "buy a car";
        } else {
            plan = "take the bus";
        }
        System.out.println(plan);

        String plan2 = cash >= 100 ? "buy a car" : "take the bus";
        System.out.println(plan2);
    }
}
```

Output

```text
buy a car
buy a car
```

Read `cash >= 100 ? "buy a car" : "take the bus"` like a question: is cash at least 100? If yes, the value is `"buy a car"`. If not, it is `"take the bus"`. The whole thing is one value, so you can put it on the right side of `=`

---

Because it is a value, you can use it right inside a println, or inside a sum

```java
public class Main {
    public static void main(String[] args) {
        int lives = 1;
        System.out.println("You have " + lives + (lives == 1 ? " life" : " lives"));

        int price = 50;
        boolean member = true;
        int toPay = price - (member ? 10 : 0);
        System.out.println("To pay: " + toPay);
    }
}
```

Output

```text
You have 1 life
To pay: 40
```

Put the ternary in parentheses when it sits inside a longer expression. Without them, `"You have " + lives + lives == 1 ? ...` would be read in the wrong order

---

Both values must fit the same place. If the ternary goes into an `int`, both sides must be numbers. If it goes into a `String`, both sides must be text

A ternary is great for a small choice between two values. For a choice that runs several lines of code, keep using if/else: it is easier to read

---

## Mission: Wanted Level

The police in Vice City are on Tommy's tail. Store the number of wanted stars in an `int` named `stars`. Print two lines:

1. `Wanted: N star` when there is exactly one star, and `Wanted: N stars` for any other number
2. `Police: chasing` when there is at least one star, and `Police: calm` when there are none

Make each choice with the ternary operator, not with if.

**Example** for `stars = 3`

```text
Wanted: 3 stars
Police: chasing
```

**Example** for `stars = 1`

```text
Wanted: 1 star
Police: chasing
```

**Example** for `stars = 0`

```text
Wanted: 0 stars
Police: calm
```
