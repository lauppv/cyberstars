# Medium · Sort Students

Read **N** students, each with a **name** (single word) and a **grade** (integer). Sort them by grade in **ascending** order. If two students have the same grade, keep their original order (stable sort). Print the sorted list.

### Input

- First line: an integer `N` (1 ≤ N ≤ 50)
- For each student, two lines:
  - Line 1: the name (a single word)
  - Line 2: the grade (integer)

### Output

`N` lines, each with the name and grade (separated by a space), sorted by grade ascending.

### Examples

```
Input:
3
Alice
85
Bob
72
Charlie
90
Output:
Bob 72
Alice 85
Charlie 90
```

```
Input:
2
Dan
50
Eve
50
Output:
Dan 50
Eve 50
```

```
Input:
1
Alice
85
Output:
Alice 85
```

```
Input:
3
Amy
70
Zoe
70
Bob
70
Output:
Amy 70
Zoe 70
Bob 70
```

When every grade ties, the stable sort keeps the original input order —
notice it's **not** alphabetical.
