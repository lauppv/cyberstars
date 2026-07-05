# Easy · GCD and LCM

Compute the **Greatest Common Divisor (GCD)** and **Least Common Multiple (LCM)** of two positive integers using **Euclid's algorithm**.

Euclid's algorithm finds the GCD by repeatedly replacing the larger number with the remainder of dividing it by the smaller number, until the remainder is 0. Once you have the GCD, the LCM can be computed as: `LCM(A, B) = A * B / GCD(A, B)`.

### Input

- Line 1: integer `A` (1 ≤ A ≤ 10000)
- Line 2: integer `B` (1 ≤ B ≤ 10000)

### Output

- First line: `GCD: X` where X is the greatest common divisor.
- Second line: `LCM: Y` where Y is the least common multiple.

### Examples

```
Input:
12
8
Output:
GCD: 4
LCM: 24
```

```
Input:
7
13
Output:
GCD: 1
LCM: 91
```

```
Input:
9
9
Output:
GCD: 9
LCM: 9
```

When both numbers are equal, the GCD and LCM are both just that number.
