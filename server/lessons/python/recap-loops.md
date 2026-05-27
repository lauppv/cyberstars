Combine **for loops**, **while loops**, and **functions**

---

Build a **number guessing helper**. Write these functions:

**generate_hints(secret)** — takes a number and returns a list of 3 hints using a **for loop**:

- "It's even" or "It's odd"
- "It's greater than 50" or "It's 50 or less"
- "Digit sum is X" (sum all the digits of the number using a **while loop** — use `% 10` to get the last digit and `// 10` to remove it)

Call the function with **secret = 73** and print each hint on its own line

Expected output

```text
It's odd
It's greater than 50
Digit sum is 10
```
