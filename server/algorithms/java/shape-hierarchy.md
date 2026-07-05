# Medium · Shape Hierarchy

Create an **abstract** `Shape` class with an abstract method `getArea()`. Implement two subclasses: `Circle` (with radius) and `Rectangle` (with width and height).

Read shapes from stdin, create the appropriate objects, and print the **total area** of all shapes rounded to 2 decimal places.

### Input

- Line 1: number of shapes N
- For each shape:
  - Line 1: the type (`circle` or `rectangle`)
  - For `circle`, line 2: the radius (decimal number)
  - For `rectangle`, line 2: the width, line 3: the height (decimal numbers)

### Output

A single line: `Total: X` where X is the sum of all areas, formatted to 2 decimal places.

### Examples

```
Input:
3
circle
5
rectangle
4
6
circle
3

Output:
Total: 130.81
```

```
Input:
1
rectangle
10
10

Output:
Total: 100.00
```

```
Input:
0

Output:
Total: 0.00
```

With no shapes, the sum starts and stays at zero — still print `Total: 0.00`.
