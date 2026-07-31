Create a **BankAccount** class with a `balance` field and methods `deposit(amount)` and `withdraw(amount)`. Withdrawals should be rejected if the amount exceeds the current balance (print `Insufficient funds`).

Read the initial balance on the first line, then process operations from stdin. Print the final balance at the end.

### Input

- Line 1: initial balance (integer)
- Line 2: number of operations N
- For each operation, two lines:
  - Line 1: operation type (`deposit` or `withdraw`)
  - Line 2: amount (integer)

### Output

- For each rejected withdrawal: `Insufficient funds`
- Last line: `Balance: X`

### Examples

```
Input:
100
3
deposit
50
withdraw
30
withdraw
200

Output:
Insufficient funds
Balance: 120
```

```
Input:
0
2
deposit
500
withdraw
500

Output:
Balance: 0
```

```
Input:
50
1
withdraw
50

Output:
Balance: 0
```

Withdrawing the **exact** balance is allowed — it only fails when the amount
is strictly greater than what's available.

```
Input:
10
2
withdraw
20
withdraw
15

Output:
Insufficient funds
Insufficient funds
Balance: 10
```
