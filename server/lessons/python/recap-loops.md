Combine **for loops**, **while loops**, and **functions**

---

## Mission: Number Hints

Write a function `give_hints(secret)` that prints **four** hints about a number, then call it with the value in `secret`.

The hints, in order:

1. `It's even` or `It's odd` (use `% 2`)
2. `It's greater than 50` or `It's 50 or less`
3. `Digit sum is` followed by the sum of the number's digits, computed with a **while loop** (`% 10` gives the last digit, `// 10` removes it). For 73 that is 7 + 3, so `Digit sum is 10`
4. `It's prime` or `It's not prime` — use a **for loop** from 2 up to the number, with a flag variable, to check whether anything divides it evenly

**Input** (already set at the top of your code — change it to test):

- `secret` — the number to analyze

**Example**

With `secret = 73`, your program should print

```text
It's odd
It's greater than 50
Digit sum is 10
It's prime
```
