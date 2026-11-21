An array holds a row of values. But many things are a table: a chessboard, the floors and rooms of a building, the seats of a cinema. For a table, Java has the **2D array**: an array whose elements are arrays

---

You write two pairs of brackets. Each inner `{ }` is one row

```java
public class Main {
    public static void main(String[] args) {
        int[][] grid = {
            { 1, 2, 3 },
            { 4, 5, 6 }
        };
        System.out.println(grid[0][2]);
        System.out.println(grid[1][0]);
    }
}
```

Output

```text
3
4
```

`grid[1][0]` means row 1, then column 0 inside it. Both start counting from 0, so this is the first number of the second row

---

How big is it? `grid.length` is the number of rows. `grid[0].length` is the number of columns in row 0

```java
public class Main {
    public static void main(String[] args) {
        int[][] grid = new int[3][4];
        System.out.println(grid.length);
        System.out.println(grid[0].length);
        System.out.println(grid[2][3]);
    }
}
```

Output

```text
3
4
0
```

`new int[3][4]` makes 3 rows of 4 numbers, all starting at 0

---

To visit every cell, you put a loop inside a loop: the outer one goes over the rows, the inner one over the columns of that row

```java
public class Main {
    public static void main(String[] args) {
        int[][] seats = {
            { 1, 0, 1 },
            { 0, 0, 1 },
            { 1, 1, 1 }
        };
        for (int row = 0; row < seats.length; row++) {
            int taken = 0;
            for (int col = 0; col < seats[row].length; col++) {
                taken += seats[row][col];
            }
            System.out.println("Row " + row + ": " + taken + " taken");
        }
    }
}
```

Output

```text
Row 0: 2 taken
Row 1: 1 taken
Row 2: 3 taken
```

Use `seats[row].length` in the inner loop, not a fixed number. Then the code works for a table of any size

---

The rows don't even have to be the same length, because each row is its own array

```java
public class Main {
    public static void main(String[] args) {
        String[][] crews = {
            { "Tommy", "Lance" },
            { "Ken" },
            { "Sonny", "Diaz", "Avery" }
        };
        for (String[] crew : crews) {
            System.out.println(crew.length + " people, first is " + crew[0]);
        }
    }
}
```

Output

```text
2 people, first is Tommy
1 people, first is Ken
3 people, first is Sonny
```

The for-each works here too: each step gives you one whole row

---

## Mission: The Vault

Tommy got the map of the bank's vault. It is a 2D array of how much cash is in each safe: one row per floor, one number per safe. Store it in an `int[][]` named `vault`.

1. For each floor, print `Floor N: total`, with floors counted from 1
2. Then print the richest safe as `Best safe: floor F, safe S, cash C`, with floors and safes counted from 1. If two safes hold the same amount, keep the first one you meet, going floor by floor from the top of the array

**Example** for `vault = { { 100, 500, 20 }, { 0, 900, 50 } }`

```text
Floor 1: 620
Floor 2: 950
Best safe: floor 2, safe 2, cash 900
```

**Example** for `vault = { { 7 } }`

```text
Floor 1: 7
Best safe: floor 1, safe 1, cash 7
```

**Example** for `vault = { { 5, 5 }, { 5 }, { 1, 2, 3 } }`

```text
Floor 1: 10
Floor 2: 5
Floor 3: 6
Best safe: floor 1, safe 1, cash 5
```
