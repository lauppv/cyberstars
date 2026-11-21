An array holds a row of values. Some data comes as a table, with rows and columns: a seating plan, a chess board, the lamps on a panel. For that, C lets us make an **array of arrays**, a 2D array

```c
#include <stdio.h>

int main(void) {
    int grid[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    printf("%d\n", grid[0][2]);
    printf("%d\n", grid[1][0]);
    return 0;
}
```

Output

```text
3
4
```

`int grid[2][3]` means 2 rows, and 3 values in each row. The first index picks the row, the second one picks the column. Both start from 0, as always: grid[0][2] is row 0, column 2

---

To walk through a whole table, we use the nested loops from the last lesson. The outer loop goes over the rows, the inner loop goes over the columns of that row

```c
#include <stdio.h>

int main(void) {
    int grid[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            printf("%d ", grid[r][c]);
        }
        printf("\n");
    }
    return 0;
}
```

Output

```text
1 2 3
4 5 6
```

---

Reading a table from input works the same way, with scanf in the inner loop. The size must be fixed when we write the code, so we make the array big enough for the largest table and use only a part of it

```c
#include <stdio.h>

int main(void) {
    int rows, cols;
    int grid[10][10];
    scanf("%d %d", &rows, &cols);
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            scanf("%d", &grid[r][c]);
        }
    }

    for (int r = 0; r < rows; r++) {
        int sum = 0;
        for (int c = 0; c < cols; c++) {
            sum = sum + grid[r][c];
        }
        printf("Row %d: %d\n", r, sum);
    }
    return 0;
}
```

Input

```text
2 3
1 2 3
4 5 6
```

Output

```text
Row 0: 6
Row 1: 15
```

---

To go down a column instead of along a row, swap the loops: keep the column fixed and move through the rows

---

A 2D array can go to a function too. C needs to know how long each row is, so the second size must be written in the parameter. The first one can stay empty

```c
#include <stdio.h>

int column_sum(int grid[][3], int rows, int col) {
    int sum = 0;
    for (int r = 0; r < rows; r++) {
        sum = sum + grid[r][col];
    }
    return sum;
}

int main(void) {
    int grid[2][3] = {
        { 1, 2, 3 },
        { 4, 5, 6 }
    };
    printf("%d\n", column_sum(grid, 2, 1));
    return 0;
}
```

Output

```text
7
```

Why does C need the row length? In memory, the rows sit one after another in a single line: 1 2 3 4 5 6. To find grid[1][0], C jumps over one whole row, and for that it must know how many values a row has

---

## Mission: The Core Memory Plane

Old computers kept their memory in a plane of tiny magnetic rings, called cores, set in rows and columns. Each core holds a 1 or a 0. A technician is testing one plane and wants to know how full each row is, and which column has the most 1s

1. Read the number of rows and the number of columns, then the plane itself, one row per line. Keep it in a 2D array
2. Print how many 1s each row has. Number the rows from 1, as in the example
3. Write a function **int count_column(int plane[][10], int rows, int col)** that returns how many 1s column col has
4. Use it to find the column with the most 1s, and print its number, also counting from 1. When two columns have the same count, pick the one more to the left

The plane has from 1 to 10 rows and from 1 to 10 columns

**Example**

Input

```text
3 4
1 0 1 1
0 0 1 0
1 1 1 0
```

Output

```text
Row 1: 3
Row 2: 1
Row 3: 3
Busiest column: 3
```

**Example**

Input

```text
2 2
0 0
0 0
```

Output

```text
Row 1: 0
Row 2: 0
Busiest column: 1
```
