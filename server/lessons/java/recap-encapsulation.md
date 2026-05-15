Combine **getters/setters**, **toString**, **static keyword**, and **final keyword**

---

Build a **bank account system**. Create a class **BankAccount** with:

- **private** fields: **owner** (String), **balance** (double), **accountId** (int)
- A **private static int nextId** = 1 (tracks the next ID to assign)
- A **final double MIN_BALANCE** = 0.0 (can't go below zero)
- **Constructor** takes owner and initial balance. Auto-assigns **accountId** from nextId and increments it
- **Getter** for owner, balance, and accountId
- **deposit(double amount)** — adds to balance
- **withdraw(double amount)** — subtracts if balance stays >= MIN_BALANCE, otherwise prints "Insufficient funds"
- **toString()** — returns "Account #X (Owner) - Balance: Y EUR"
- **static int getTotalAccounts()** — returns how many accounts were created

Test:
```java
public class Main {
    public static void main(String[] args) {
        BankAccount a1 = new BankAccount("Tommy", 1000);
        BankAccount a2 = new BankAccount("Lance", 500);

        a1.deposit(250);
        a2.withdraw(200);
        a2.withdraw(400);

        System.out.println(a1);
        System.out.println(a2);
        System.out.println("Total accounts: " + BankAccount.getTotalAccounts());
    }
}
```

Expected output
```text
Insufficient funds
Account #1 (Tommy) - Balance: 1250.0 EUR
Account #2 (Lance) - Balance: 300.0 EUR
Total accounts: 2
```
