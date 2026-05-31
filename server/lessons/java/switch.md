You know if-else chains. They work great for 2-3 options. But when you have **many** options — like checking which day of the week it is, or which weapon Tommy picked — the code gets ugly fast. That's where **switch** comes in

```java
public class Main {
    public static void main(String[] args) {
        String weapon = "shotgun";

        switch (weapon) {
            case "pistol":
                System.out.println("Basic but reliable");
                break;
            case "shotgun":
                System.out.println("Devastating up close");
                break;
            case "rocket":
                System.out.println("Total overkill");
                break;
            default:
                System.out.println("Unknown weapon");
                break;
        }
    }
}
```

Output

```text
Devastating up close
```

The **switch** checks the value of `weapon` and jumps to the matching **case**. When it finds `"shotgun"`, it runs that block, then **break** tells it to stop and exit the switch

---

**break** is crucial. Without it, Java "falls through" to the next case and keeps running

```java
public class Main {
    public static void main(String[] args) {
        int stars = 3;

        switch (stars) {
            case 1:
                System.out.println("Cops notice you");
            case 2:
                System.out.println("Cops chase you");
            case 3:
                System.out.println("Helicopter shows up");
            case 4:
                System.out.println("SWAT arrives");
            case 5:
                System.out.println("Army tanks roll in");
        }
    }
}
```

Output

```text
Helicopter shows up
SWAT arrives
Army tanks roll in
```

Whoa — we only wanted the 3-star message, but it printed 3, 4, AND 5! That's because without **break**, Java falls through every case below the match. Sometimes this is useful on purpose, but usually it's a bug. **Always add break** unless you specifically want fall-through

---

The correct version with break

```java
public class Main {
    public static void main(String[] args) {
        int stars = 3;

        switch (stars) {
            case 3:
                System.out.println("Helicopter shows up");
                break;
            case 4:
                System.out.println("SWAT arrives");
                break;
            case 5:
                System.out.println("Army tanks roll in");
                break;
        }
    }
}
```

Output

```text
Helicopter shows up
```

---

**default** is like the `else` in an if-else chain — it handles anything that doesn't match any case

```java
public class Main {
    public static void main(String[] args) {
        String vehicle = "boat";

        switch (vehicle) {
            case "car":
                System.out.println("Drive on roads");
                break;
            case "bike":
                System.out.println("Weave through traffic");
                break;
            default:
                System.out.println("Some other vehicle: " + vehicle);
                break;
        }
    }
}
```

Output

```text
Some other vehicle: boat
```

---

Python didn't have switch until recently (match/case in 3.10+). In Java, switch has been around forever and works with **int**, **String**, **char**, and **enum** types. Here's a comparison

```python
# Python if-else chain
day = "Monday"
if day == "Saturday" or day == "Sunday":
    print("Weekend")
else:
    print("Weekday")
```

```java
public class Main {
    public static void main(String[] args) {
        // Java switch
        String day = "Monday";
        switch (day) {
            case "Saturday":
            case "Sunday":
                System.out.println("Weekend");
                break;
            default:
                System.out.println("Weekday");
                break;
        }
    }
}
```

Notice how we stacked `case "Saturday":` and `case "Sunday":` together with no code between them — that's **intentional fall-through**. Both cases run the same code. This is the one time fall-through is actually handy

---

Switch with **int** is very common too

```java
public class Main {
    public static void main(String[] args) {
        int menuChoice = 2;

        switch (menuChoice) {
            case 1:
                System.out.println("Start new game");
                break;
            case 2:
                System.out.println("Load saved game");
                break;
            case 3:
                System.out.println("Settings");
                break;
            default:
                System.out.println("Invalid choice");
                break;
        }
    }
}
```

Output

```text
Load saved game
```

---

## Mission: Duty Roster Classifier

The station's duty roster needs a quick classifier: given a day name, print whether it is a **Weekday** or a **Weekend** shift.

Write the body of the `dayType` method using a **switch** on `day`:

1. For `"Monday"` through `"Friday"` → print `Weekday`
2. For `"Saturday"` and `"Sunday"` → print `Weekend`
3. Default → print `Unknown day`

The `main` method already calls `dayType` three times.

**Example**

With the calls `dayType("Monday")`, `dayType("Saturday")`, `dayType("Wednesday")`, your program should print

```text
Weekday
Weekend
Weekday
```
