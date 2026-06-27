Combine **getters/setters**, **toString**, **static keyword**, and **final keyword**

---

## Mission: Tommy's Accounts

Tommy keeps the crew's money at the bank, and each member has their own account. Build the account system with proper encapsulation so no one can tamper with balances directly.

Create a class **`BankAccount`** with:

- **private** fields: `owner` (String), `balance` (int), `accountId` (int)
- a **`private static int nextId`** = 1 (tracks the next ID to assign)
- a **`final int MIN_BALANCE`** = 0 (balance can't go below zero)
- a **constructor** taking owner and initial balance; auto-assigns `accountId` from `nextId` and increments it
- **getters** for owner, balance, and accountId
- **`deposit(int amount)`** — adds to balance
- **`withdraw(int amount)`** — subtracts only if balance stays >= `MIN_BALANCE`, otherwise prints `"Insufficient funds"`
- **`toString()`** — returns `"Account #X (Owner) - Balance: Y$"`
- **`static int getTotalAccounts()`** — returns how many accounts were created

In `main`, create a few accounts, make deposits and withdrawals however you like (including one withdrawal that fails, so you see the message), then print the accounts and the total

**Example** — Tommy opens with 1000 and deposits 250; Lance opens with 500, withdraws 200, then tries to withdraw 400 (fails)

```text
Insufficient funds
Account #1 (Tommy) - Balance: 1250$
Account #2 (Lance) - Balance: 300$
Total accounts: 2
```
