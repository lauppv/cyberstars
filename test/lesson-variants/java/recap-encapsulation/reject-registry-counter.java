class Bank {
    private int nextId = 1;

    int issueId() {
        return nextId++;
    }

    int getTotalAccounts() {
        return nextId - 1;
    }
}

class BankAccount {
    private final int MIN_BALANCE = 0;
    private final String owner;
    private int balance;
    private final int accountId;

    BankAccount(Bank bank, String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
        this.accountId = bank.issueId();
    }

    String getOwner() { return owner; }
    int getBalance() { return balance; }
    int getAccountId() { return accountId; }

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

    public String toString() {
        return "Account #" + accountId + " (" + owner + ") - Balance: " + balance + "$";
    }
}

public class Main {
    public static void main(String[] args) {
        String owner1 = "Tommy";
        int balance1 = 1000;
        String owner2 = "Lance";
        int balance2 = 500;
        int deposit1 = 250;
        int withdraw1 = 200;
        int withdraw2 = 400;

        Bank bank = new Bank();
        BankAccount first = new BankAccount(bank, owner1, balance1);
        BankAccount second = new BankAccount(bank, owner2, balance2);
        first.deposit(deposit1);
        second.withdraw(withdraw1);
        second.withdraw(withdraw2);
        System.out.println(first);
        System.out.println(second);
        System.out.println("Total accounts: " + bank.getTotalAccounts());
    }
}
