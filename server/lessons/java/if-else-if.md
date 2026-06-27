Sometimes we need **more than two** branches. Imagine a rocket launching from the ground. Depending on how many seconds are left, we want to do different things

If we have **100** seconds left → start the onboard computers

If we have **60** seconds left → check the connection with the control tower

If we have **20** seconds left → start the secondary engines

If we have **10** seconds left → start the main engines

Otherwise → do nothing special

In Java we use **else if** — two words, spelled out

```java
public class Main {
    public static void main(String[] args) {
        int seconds = 100;

        if (seconds == 100) {
            System.out.println("Starting all onboard computers");
        } else if (seconds == 60) {
            System.out.println("Checking connection with the control tower");
        } else if (seconds == 20) {
            System.out.println("Starting secondary engines");
        } else if (seconds == 10) {
            System.out.println("Starting the main engines");
        } else {
            System.out.println(seconds + " seconds has no effect");
        }
    }
}
```

**Run** this. Then change **seconds** to **60**, **20**, **10**, **9**, **42**. See how the output changes

The chain runs **top to bottom**. At the **first** condition that is **true**, Java enters that block, runs it, and **jumps out** of the whole chain. The remaining branches are **never** checked. This is important — if **seconds == 60**, the chain prints **"Checking connection..."** and then exits

---

Why not just write a bunch of separate **if**s? Like this

```java
public class Main {
    public static void main(String[] args) {
        int seconds = 60;
        if (seconds == 100) { System.out.println("100"); }
        if (seconds == 60) { System.out.println("60"); }
        if (seconds == 20) { System.out.println("20"); }
        else { System.out.println("other"); }
    }
}
```

The problem: each **if** is independent. The **else** at the end belongs only to the **last if**. So for **seconds = 60**, the third if fails (60 != 20), and the **else** kicks in printing **"60 seconds has no effect"**, which is wrong — we already handled 60 above!

**Rule of thumb**: when we test the **same variable** for multiple values, we **chain** with **if / else if / else**

---

We can also nest **if**s inside one another

```java
public class Main {
    public static void main(String[] args) {
        int seconds = 5;
        boolean errorDetected = false;

        if (seconds < 10) {
            if (errorDetected) {
                System.out.println("Error detected. Canceling the mission");
            } else {
                System.out.println("No error detected. Taking off...");
            }
        }
    }
}
```

Here, only **if** we’re in the last 10 seconds, we check the error flag. Nested **if**s are fine, but if you nest 5 levels deep, your code becomes unreadable. Try to keep things flat when you can

---

## Mission: Launch Sequence

The countdown timer is running. Depending on how many seconds remain until launch, the system performs a different action:

- at **100** seconds → print `Starting all onboard computers`
- at **60** seconds → print `Checking connection with the control tower`
- at **20** seconds → print `Starting secondary engines`
- at **10** seconds → print `Starting the main engines`
- in any other case → print `Standing by...`

Store the number of seconds in an `int` variable and write an `if / else if / else` chain that prints the correct action.

**Examples**

At `100` seconds:

```text
Starting all onboard computers
```

At `60` seconds:

```text
Checking connection with the control tower
```

At `200` seconds (no branch matches, `else` runs):

```text
Standing by...
```
