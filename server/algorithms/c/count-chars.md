Read a string (single word) and a character. Count how many times that character appears in the string and print the count.

### Input

- First line: a single word of 1 to 1000 characters, with no spaces (letters, digits and punctuation: any printable ASCII character)
- Second line: a single character, any printable ASCII character except a space

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
