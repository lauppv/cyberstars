# Medium · Sort Students

Read **N** students, each with a **name** (single word) and a **grade** (integer). Sort them by grade in **ascending** order. If two students have the same grade, keep their original order (stable sort). Print the sorted list.

This exercise practices defining and using `struct` in C, plus sorting an array of structs.

### Input

- First line: an integer `N` (1 ≤ N ≤ 50)
- Next `N` lines: a name (string, no spaces) and a grade (integer), separated by a space

### Output

`N` lines, each with the name and grade, sorted by grade ascending.

### Examples

```
Input:
3
Alice 85
Bob 72
Charlie 90
Output:
Bob 72
Alice 85
Charlie 90
```

```
Input:
2
Dan 50
Eve 50
Output:
Dan 50
Eve 50
```

```
Input:
1
Alice 85
Output:
Alice 85
```

```
Input:
3
Amy 70
Zoe 70
Bob 70
Output:
Amy 70
Zoe 70
Bob 70
```

When every grade ties, the stable sort keeps the original input order —
notice it's **not** alphabetical.
