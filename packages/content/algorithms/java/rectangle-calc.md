Create a **Rectangle** class with `width` and `height` fields. Add methods `getArea()` and `getPerimeter()` that return the area and perimeter of the rectangle.

Read the width and height from stdin, create a `Rectangle` object, and print the area and perimeter on separate lines.

### Input

- Line 1: the width (integer, 1 <= width <= 10^4)
- Line 2: the height (integer, 1 <= height <= 10^4)
- With these limits the area (at most 10^8) and the perimeter always fit in an `int`

### Output

- Line 1: `Area: X`
- Line 2: `Perimeter: X`

### Examples

```
Input:
5
3

Output:
Area: 15
Perimeter: 16
```

```
Input:
10
10

Output:
Area: 100
Perimeter: 40
```

```
Input:
1
1

Output:
Area: 1
Perimeter: 4
```

The smallest possible rectangle: a 1x1 square.
