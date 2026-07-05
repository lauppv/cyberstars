# Easy · Student GPA

Create a **Student** class that stores a student's name and an array of grades. The class should have a method `getGPA()` that computes the average of all grades.

Read the student's name and grades from stdin, create a `Student` object, and print the average rounded to **2 decimal places**.

### Input

- Line 1: the student's name
- Line 2: the number of grades N
- The next N lines: one grade per line (integer)

### Output

A single line: the average as a decimal with exactly 2 decimal places.

### Examples

```
Input:
Alice
4
90
85
92
88

Output:
88.75
```

```
Input:
Bob
3
100
100
100

Output:
100.00
```

```
Input:
Carol
1
95

Output:
95.00
```

A single grade — the average is just that grade, still formatted to 2 decimals.
