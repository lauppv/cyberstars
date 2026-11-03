import java.util.*;

class BankAccount {
    private int balance;

    BankAccount(int balance) {
        this.balance = balance;
    }

    void deposit(int amount) {
        balance += amount;
    }

    void withdraw(int amount) {
        balance -= amount;
    }

    int getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        BankAccount account = new BankAccount(Integer.parseInt(in.nextLine()));
        int n = Integer.parseInt(in.nextLine());
        for (int i = 0; i < n; i++) {
            String op = in.nextLine();
            int amount = Integer.parseInt(in.nextLine());
            if (op.equals("deposit")) account.deposit(amount);
            else account.withdraw(amount);
        }
        System.out.println("Balance: " + account.getBalance());
    }
}
