Create a **Student** class that implements `Comparable<Student>`. Each student has a `name` and a `gpa` (double). Students should be sorted by GPA in **descending** order. If two students have the same GPA, sort by name **alphabetically**.

Read students from stdin, sort them, and print each student on a separate line.

### Input

- Line 1: number of students N
- For each student, two lines:
  - Line 1: the name (a single word)
  - Line 2: the GPA (decimal number)

### Output

N lines, each in the format: `name gpa` (GPA with 1 decimal place), sorted by GPA descending then name ascending.

### Examples

```
Input:
3
Alice
3.8
Bob
3.9
Carol
3.8

Output:
Bob 3.9
Alice 3.8
Carol 3.8
```

```
Input:
2
Zoe
4.0
Amy
4.0

Output:
Amy 4.0
Zoe 4.0
```

```
Input:
1
Max
3.5

Output:
Max 3.5
```

A single student needs no comparison — it's already "sorted".

```
Input:
3
Eve
3.5
Ana
3.5
Bob
3.5

Output:
Ana 3.5
Bob 3.5
Eve 3.5
```

When every GPA ties, the whole list falls back to alphabetical order.
