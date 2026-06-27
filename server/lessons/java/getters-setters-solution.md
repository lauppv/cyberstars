```java
class BankAccount {
    private int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }

    int getBalance() {
        return balance;
    }

    void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    void withdraw(int amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        acc.deposit(500);
        acc.withdraw(200);
        acc.withdraw(2000);
        System.out.println(acc.getBalance());
    }
}
```
