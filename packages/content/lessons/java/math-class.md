You met `Math.pow` and `Math.max` before. They live in the **Math** class, a toolbox of ready-made number helpers. You don't create anything to use it: you write `Math.` and the name of the helper

---

Distances and sizes: **abs** and **sqrt**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.abs(-7));      // 7
        System.out.println(Math.abs(7));       // 7
        System.out.println(Math.sqrt(25));     // 5.0
        System.out.println(Math.sqrt(2));      // 1.4142135623730951
    }
}
```

Output

```text
7
7
5.0
1.4142135623730951
```

`Math.abs` drops the minus sign, so it tells how far a number is from zero. `Math.sqrt` gives the square root, always as a double

---

Rounding: **round**, **floor** and **ceil**

```java
public class Main {
    public static void main(String[] args) {
        double price = 7.5;
        System.out.println(Math.round(price));   // 8
        System.out.println(Math.floor(price));   // 7.0
        System.out.println(Math.ceil(price));    // 8.0
        System.out.println(Math.ceil(7.1));      // 8.0
    }
}
```

Output

```text
8
7.0
8.0
8.0
```

- `Math.round` goes to the nearest whole number, and gives it back without decimals
- `Math.floor` always goes down
- `Math.ceil` always goes up, even from 7.1. Think of buses: 71 people need 8 buses of 10, not 7

`floor` and `ceil` give back a double, so they print with `.0`

---

Bigger, smaller, powers

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.max(4, 9));    // 9
        System.out.println(Math.min(4, 9));    // 4
        System.out.println(Math.pow(3, 2));    // 9.0
        System.out.println(Math.PI);           // 3.141592653589793
    }
}
```

Output

```text
9
4
9.0
3.141592653589793
```

`Math.PI` is not a method, so it has no parentheses. It is a fixed value stored in the Math class

There is also `Math.random()`, which gives a random double from 0 up to (but not including) 1. Games use it for dice and loot. Its value is different on every run, so you won't see it in a mission here

---

A classic use: the straight-line distance between two points. Go `dx` across and `dy` up, and the distance is `sqrt(dx² + dy²)`

```java
public class Main {
    public static void main(String[] args) {
        int dx = 6;
        int dy = 8;
        double distance = Math.sqrt(dx * dx + dy * dy);
        System.out.println(distance);
    }
}
```

Output

```text
10.0
```

---

## Mission: Helicopter Ride

Tommy has to get from one corner of the city to another. The city is a grid of blocks. Store his start in two `int` variables `x1` and `y1`, and the place he goes to in `x2` and `y2`.

Print three lines:

1. `Walk: N blocks`: on foot he can only go along the streets, so he walks the distance across plus the distance up or down
2. `Fly: N`: the helicopter flies in a straight line. Round it to the nearest whole number
3. `Longest leg: N`: the longer of the two walks, across or up and down

The points can be in any order, so a distance across can come out negative. Make it positive with the Math class.

**Example** for `x1 = 0, y1 = 0, x2 = 3, y2 = 4`

```text
Walk: 7 blocks
Fly: 5
Longest leg: 4
```

**Example** for `x1 = 5, y1 = 1, x2 = 2, y2 = 3`

```text
Walk: 5 blocks
Fly: 4
Longest leg: 3
```

**Example** for `x1 = 2, y1 = 2, x2 = 2, y2 = 2`

```text
Walk: 0 blocks
Fly: 0
Longest leg: 0
```
