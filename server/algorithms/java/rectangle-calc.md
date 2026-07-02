# Easy · Rectangle Calculator

Create a **Rectangle** class with `width` and `height` fields. Add methods `getArea()` and `getPerimeter()` that return the area and perimeter of the rectangle.

Read width and height from stdin, create a `Rectangle` object, and print the area and perimeter on separate lines.

### Input

- Line 1: two integers separated by a space — width and height

### Output

- Line 1: `Area: X`
- Line 2: `Perimeter: X`

### Examples

```
Input:
5 3

Output:
Area: 15
Perimeter: 16
```

```
Input:
10 10

Output:
Area: 100
Perimeter: 40
```

```
Input:
1 1

Output:
Area: 1
Perimeter: 4
```

The smallest possible rectangle — a 1x1 square.

### Hints

- Area = width \* height.
- Perimeter = 2 \* (width + height).
- The class should encapsulate the fields and expose getter-style methods.
- Use integer arithmetic — no decimals needed.
