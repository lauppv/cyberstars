# Easy · Count Characters

Read a string (single word) and a character. Count how many times that character appears in the string and print the count.

This exercise practices iterating through a C string and comparing characters.

### Input

- First line: a single word (max 1000 characters)
- Second line: a single character

### Output

A single integer: the number of occurrences of the character in the string.

### Examples

```
Input:
banana
a
Output: 3
```

```
Input:
hello
z
Output: 0
```

```
Input:
aaaa
a
Output: 4
```

```
Input:
Apple
a
Output: 0
```

The comparison is case-sensitive: `Apple` has an uppercase `A`, so it doesn't
match the lowercase `a` being counted.

### Hints

- Read the string with `scanf("%s", str)` and the char with `scanf(" %c", &ch)` (note the space before `%c` to skip whitespace).
- Loop through each character and compare with `ch`.
