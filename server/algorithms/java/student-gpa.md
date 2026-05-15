# Easy · Student GPA

Create a **Student** class that stores a student's name and an array of grades. The class should have a method `getGPA()` that computes the average of all grades.

Read the student's name and grades from stdin, create a `Student` object, and print the GPA rounded to **2 decimal places**.

### Input
- Line 1: student name (string)
- Line 2: grades separated by spaces (integers)

### Output
A single line: the GPA as a decimal with exactly 2 decimal places.

### Examples

```
Input:
Alice
90 85 92 88

Output:
88.75
```

```
Input:
Bob
100 100 100

Output:
100.00
```

### Hints
- Store grades in an `int[]` or `ArrayList<Integer>`.
- Use `String.format("%.2f", value)` to format to 2 decimal places.
- Sum all grades and divide by the count (use `double` division).
- The `Student` class should have a constructor that takes name and grades.
