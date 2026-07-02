# Easy · Palindrome Number

Check if an integer is a **palindrome** — a number that reads the same forwards and backwards.

Negative numbers are never palindromes (because of the minus sign). Single-digit numbers are always palindromes.

### Input

- Line 1: a single integer

### Output

- `true` if the number is a palindrome, `false` otherwise.

### Examples

```
Input:
121

Output:
true
```

```
Input:
-121

Output:
false
```

```
Input:
10

Output:
false
```

```
Input:
0

Output:
true
```

A single-digit number, including 0, always reads the same both ways.

```
Input:
12321

Output:
true
```

### Hints

- Negative numbers always return `false`.
- One approach: reverse the number digit by digit and compare with the original.
- To get the last digit: `num % 10`. To remove the last digit: `num / 10`.
- Build the reversed number by multiplying by 10 and adding each digit.
- Another approach: convert to a string and check if it equals its reverse.
