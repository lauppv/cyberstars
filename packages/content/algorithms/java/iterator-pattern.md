Implement the **Iterable** and **Iterator** interfaces to create a `NumberRange` class that iterates over a range of integers.

`NumberRange` takes a `start` and `end` value and lets you iterate over all integers from `start` to `end` (inclusive) using a for-each loop.

Read start and end from stdin, create a `NumberRange`, and print each number on a separate line.

### Input

- Line 1: the start of the range (integer, -10^9 <= start <= 10^9)
- Line 2: the end of the range (integer, start <= end <= 10^9)
- The start is never greater than the end, and the range holds at most 2·10^4 + 1 numbers (end - start <= 2·10^4)

### Output

Each number from start to end (inclusive), one per line.

### Examples

```
Input:
1
5

Output:
1
2
3
4
5
```

```
Input:
3
3

Output:
3
```

```
Input:
-2
2

Output:
-2
-1
0
1
2
```
