You already know `String.format` with `%s`, `%d` and `%.2f`. It can do much more: it can give every value a fixed width, so a list of names and numbers lines up in neat columns, like a real scoreboard

---

Put a number between `%` and the letter, and the value takes up at least that many characters. Spaces fill the rest, on the left

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("[%5d]", 42));
        System.out.println(String.format("[%5d]", 12345));
        System.out.println(String.format("[%8s]", "Tommy"));
    }
}
```

Output

```text
[   42]
[12345]
[   Tommy]
```

The brackets are only there so you can see the spaces. A value that is already wider than the space is never cut, it just takes more room

---

A minus sign pushes the value to the left and puts the spaces after it. Names usually go on the left, numbers on the right

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("%-8s%4d", "Tommy", 7));
        System.out.println(String.format("%-8s%4d", "Lance", 12));
        System.out.println(String.format("%-8s%4d", "Ken", 105));
    }
}
```

Output

```text
Tommy      7
Lance     12
Ken      105
```

Every row uses the same widths, so the columns line up

---

More useful flags:

- `%05d` fills with zeros instead of spaces: `42` becomes `00042`
- `%,d` puts a comma between thousands: `1500000` becomes `1,500,000`
- `%8.2f` gives a double 2 decimals and a width of 8

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("Ticket %05d", 42));
        System.out.println(String.format("Cash: %,d", 1500000));
        System.out.println(String.format("[%8.2f]", 3.14159));
    }
}
```

Output

```text
Ticket 00042
Cash: 1,500,000
[    3.14]
```

---

`System.out.printf` does the same as `String.format`, but prints right away. It doesn't add a new line on its own, so you end the pattern with `%n`

```java
public class Main {
    public static void main(String[] args) {
        String boat = "Squalo";
        int speed = 95;
        System.out.printf("%-10s%5d km/h%n", boat, speed);
        System.out.printf("%-10s%5d km/h%n", "Jetmax", 120);
    }
}
```

Output

```text
Squalo       95 km/h
Jetmax      120 km/h
```

Use `String.format` when you want to keep the text in a variable, and `printf` when you only want to print it

---

## Mission: Money Board

At the end of the night Tommy wants a board with how much each member of the crew brought in. Store the names in a `String` array named `names` and the money in an `int` array named `cash`, in the same order.

Print one row for each member, then a last row with the word `TOTAL` and the sum. In every row:

* the name takes 10 characters, on the left
* the money takes 12 characters, on the right, with commas between thousands

**Example** for `names = { "Tommy", "Lance", "Ken" }` and `cash = { 1500000, 25000, 980 }`

```text
Tommy        1,500,000
Lance           25,000
Ken                980
TOTAL        1,525,980
```

**Example** for `names = { "Mercedes" }` and `cash = { 4200 }`

```text
Mercedes         4,200
TOTAL            4,200
```
