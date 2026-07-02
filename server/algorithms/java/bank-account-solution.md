```java
import java.util.Scanner;

class BankAccount {
    private int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }

    void deposit(int amount) {
        balance += amount;
    }

    boolean withdraw(int amount) {
        if (amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int balance = Integer.parseInt(sc.nextLine().trim());
        int n = Integer.parseInt(sc.nextLine().trim());
        BankAccount account = new BankAccount(balance);
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            int amount = Integer.parseInt(parts[1]);
            if (parts[0].equals("deposit")) {
                account.deposit(amount);
            } else {
                if (!account.withdraw(amount)) {
                    System.out.println("Insufficient funds");
                }
            }
        }
        System.out.println("Balance: " + account.getBalance());
    }
}
```
