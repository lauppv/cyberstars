```java
class BankAccount {
    private String owner;
    private int balance;
    private int accountId;
    private static int nextId = 1;
    private final int MIN_BALANCE = 0;

    BankAccount(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
        this.accountId = nextId;
        nextId++;
    }

    String getOwner() {
        return owner;
    }

    int getBalance() {
        return balance;
    }

    int getAccountId() {
        return accountId;
    }

    void deposit(int amount) {
        balance += amount;
    }

    void withdraw(int amount) {
        if (balance - amount >= MIN_BALANCE) {
            balance -= amount;
        } else {
            System.out.println("Insufficient funds");
        }
    }

    @Override
    public String toString() {
        return "Account #" + accountId + " (" + owner + ") - Balance: " + balance + "$";
    }

    static int getTotalAccounts() {
        return nextId - 1;
    }
}

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
