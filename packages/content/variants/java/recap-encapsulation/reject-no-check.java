class BankAccount {
    private String owner;
    private int balance;
    private int accountId;
    private static int nextId = 1;

    BankAccount(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
        this.accountId = nextId++;
    }

    void deposit(int amount) { balance += amount; }

    void withdraw(int amount) {
        if (amount == 400) System.out.println("Insufficient funds");
        else balance -= amount;
    }

    static int getTotalAccounts() { return nextId - 1; }

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
        BankAccount a1 = new BankAccount(owner1, balance1);
        BankAccount a2 = new BankAccount(owner2, balance2);
        a1.deposit(deposit1);
        a2.withdraw(withdraw1);
        a2.withdraw(withdraw2);
        System.out.println(a1);
        System.out.println(a2);
        System.out.println("Total accounts: " + BankAccount.getTotalAccounts());
    }
}
