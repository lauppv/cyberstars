# Medium · Sort Students

Create a **Student** class that implements `Comparable<Student>`. Each student has a `name` and a `gpa` (double). Students should be sorted by GPA in **descending** order. If two students have the same GPA, sort by name **alphabetically**.

Read students from stdin, sort them, and print each student on a separate line.

### Input

- Line 1: number of students N
- Next N lines: `name gpa` (name is a single word, gpa is a decimal)

### Output

N lines, each in the format: `name gpa` (GPA with 1 decimal place), sorted by GPA descending then name ascending.

### Examples

```
Input:
3
Alice 3.8
Bob 3.9
Carol 3.8

Output:
Bob 3.9
Alice 3.8
Carol 3.8
```

```
Input:
2
Zoe 4.0
Amy 4.0

Output:
Amy 4.0
Zoe 4.0
```

### Hints

- Implement `compareTo` in the Student class.
- For descending GPA: compare other's GPA to this GPA with `Double.compare()`.
- For ties, use `this.name.compareTo(other.name)`.
- Use `Collections.sort()` or `Arrays.sort()` after collecting students.
- Format GPA with `String.format("%.1f", gpa)`.
