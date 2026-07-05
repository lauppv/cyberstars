```java
import java.util.Scanner;

class BankAccount {
    private int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }

    void deposit(int amount) {
        balance = balance + amount;
    }

    boolean withdraw(int amount) {
        if (amount > balance) {
            return false;
        }
        balance = balance - amount;
        return true;
    }

    int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int balance = Integer.parseInt(sc.nextLine());
        int n = Integer.parseInt(sc.nextLine());

        BankAccount account = new BankAccount(balance);

        for (int i = 0; i < n; i++) {
            String operation = sc.nextLine();
            int amount = Integer.parseInt(sc.nextLine());

            if (operation.equals("deposit")) {
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
