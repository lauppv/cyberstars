class BankAccount {
    int balance;

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
        int start = 1000;
        int deposit = 500;
        int withdraw1 = 200;
        int withdraw2 = 2000;
        BankAccount account = new BankAccount(start);
        account.deposit(deposit);
        account.withdraw(withdraw1);
        account.withdraw(withdraw2);
        System.out.println(account.getBalance());
    }
}
