Combine **getters/setters**, **toString**, **static keyword**, and **final keyword**

---

## Mission: Station Credit Ledger

The station runs on a credit-based economy. Every crew member has an account managed by the central ledger. Build the account system with proper encapsulation so no one can tamper with balances directly.

Create a class **`BankAccount`** with:

- **private** fields: `owner` (String), `balance` (double), `accountId` (int)
- A **`private static int nextId`** = 1 (tracks the next ID to assign)
- A **`final double MIN_BALANCE`** = 0.0 (can't go below zero)
- **Constructor** takes owner and initial balance. Auto-assigns `accountId` from `nextId` and increments it
- **Getters** for owner, balance, and accountId
- **`deposit(double amount)`** — adds to balance
- **`withdraw(double amount)`** — subtracts if balance stays >= MIN_BALANCE, otherwise prints `"Insufficient funds"`
- **`toString()`** — returns `"Account #X (Owner) - Balance: Y EUR"`
- **`static int getTotalAccounts()`** — returns how many accounts were created

The test calls in main are already on the right.

**Output**

```text
Insufficient funds
Account #1 (Tommy) - Balance: 1250.0 EUR
Account #2 (Lance) - Balance: 300.0 EUR
Total accounts: 2
```
