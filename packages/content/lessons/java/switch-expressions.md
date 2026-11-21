In the Switch lesson every case ended with `break`, and forgetting one made the code fall through to the next case. Newer Java has a cleaner switch: cases with an arrow `->`, and a switch that gives back a value

---

First, the arrow. A case with `->` runs only its own code. There is no fall-through, so there is no break to forget

```java
public class Main {
    public static void main(String[] args) {
        String weapon = "shotgun";
        switch (weapon) {
            case "pistol" -> System.out.println("Basic but reliable");
            case "shotgun" -> System.out.println("Devastating up close");
            default -> System.out.println("Unknown weapon");
        }
    }
}
```

Output

```text
Devastating up close
```

---

Now the best part. A switch can give back a value, like a ternary does. This is called a **switch expression**. You put it on the right side of `=`, and every case says which value to give

```java
public class Main {
    public static void main(String[] args) {
        int day = 6;
        String name = switch (day) {
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6, 7 -> "Weekend";
            default -> "No such day";
        };
        System.out.println(name);
    }
}
```

Output

```text
Weekend
```

A few things to notice:

- `case 6, 7` lists two values for one case
- the whole switch ends with a semicolon, because it is the end of the `String name = ...` line
- a switch expression must give a value for every possible input, so it needs a `default` here

---

Sometimes a case needs more than one line before it knows its value. Then you open a block with `{ }` and give the value with **yield**

```java
public class Main {
    public static void main(String[] args) {
        String car = "Cheetah";
        int speed = switch (car) {
            case "Infernus" -> 240;
            case "Cheetah" -> {
                System.out.println("Checking the engine...");
                yield 230;
            }
            default -> 150;
        };
        System.out.println("Top speed: " + speed);
    }
}
```

Output

```text
Checking the engine...
Top speed: 230
```

`yield` is like `return`, but for one case of a switch: it gives the value and leaves the switch

---

## Mission: Taxi Fares

Tommy runs a taxi company now. The fare for one ride depends on the district. Store the district in a `String` named `district` and the number of rides in an `int` named `rides`.

The fare for one ride is:

- `Ocean Beach` or `Washington Beach`: 12
- `Downtown`: 15
- `Little Havana` or `Little Haiti`: 10
- any other district: 20

Find the fare with a switch expression. Then print the fare and the total for all the rides.

**Example** for `district = "Downtown"` and `rides = 3`

```text
Fare: 15
Total: 45
```

**Example** for `district = "Little Haiti"` and `rides = 2`

```text
Fare: 10
Total: 20
```

**Example** for `district = "Starfish Island"` and `rides = 1`

```text
Fare: 20
Total: 20
```
