Write a file, read it back, and handle what can go wrong with your own exception and a few catches

---

## Mission: The Paper Trail

Every night, Tommy's people hand in the money they collected, written as `name,amount`. Some of them write sloppy lines, and some try to cheat with negative amounts. Ken Rosenberg, the lawyer, wants it all on file

Make an exception class `NegativeAmountException` that extends `Exception`. Its message is `negative amount`

The lines are in a `String[] entries` array. Write them to the file `trail.txt`, one per line. Then read the file back. For each line, split it at the comma and turn the amount into a number:

- If the amount is not a number, print `Bad amount: line`
- If it is below 0, throw a `NegativeAmountException`, catch it and print `Rejected: line (negative amount)`, with the exception's message in the brackets
- Otherwise print `name paid amount`

At the end, print `Total: ` with the sum of the good amounts

**Example**

```text
Phil paid 500
Bad amount: Kent,lots
Rejected: Lance,-200 (negative amount)
Mercedes paid 1500
Total: 2000
```

**Example**

```text
Total: 0
```
