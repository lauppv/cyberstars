# Easy · GCD and LCM

Compute the **Greatest Common Divisor (GCD)** and **Least Common Multiple (LCM)** of two positive integers using **Euclid's algorithm**.

Euclid's algorithm finds the GCD by repeatedly replacing the larger number with the remainder of dividing it by the smaller number, until the remainder is 0. Once you have the GCD, the LCM can be computed as: `LCM(A, B) = A * B / GCD(A, B)`.

### Input

- One line containing two integers `A` and `B` (1 ≤ A, B ≤ 100000), separated by a space.

### Output

- First line: `GCD: X` where X is the greatest common divisor.
- Second line: `LCM: Y` where Y is the least common multiple.

### Examples

```
Input:
12 8
Output:
GCD: 4
LCM: 24
```

```
Input:
7 13
Output:
GCD: 1
LCM: 91
```

### Hints

- Implement Euclid's algorithm: while `b != 0`, set `temp = b`, `b = a % b`, `a = temp`. The GCD is `a`.
- Compute LCM using the formula `A * B / GCD` — divide before multiplying to avoid overflow: `A / GCD * B`.
- Save the original values of A and B before running the GCD loop, since the loop modifies them.
