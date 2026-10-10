class BankAccount {
    private String owner;
    private int balance;
    private int accountId;
    private static int nextId = 1;
    private final int MIN_BALANCE = 0;

    BankAccount(String owner, int balance) {
        this.owner = owner;
        this.balance = balance;
        accountId = nextId;
        nextId += 1;
    }

    String getOwner() { return owner; }
    int getBalance() { return balance; }
    int getAccountId() { return accountId; }

    void deposit(int amount) { balance += amount; }

    void withdraw(int amount) {
        int after = balance - amount;
        if (after < MIN_BALANCE) System.out.println("Insufficient funds");
        else balance = after;
    }

    static int getTotalAccounts() { return nextId - 1; }

    public String toString() {
        return "Account #" + getAccountId() + " (" + getOwner() + ") - Balance: " + getBalance() + "$";
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

        BankAccount[] accounts = { new BankAccount(owner1, balance1), new BankAccount(owner2, balance2) };
        accounts[0].deposit(deposit1);
        for (int w : new int[] { withdraw1, withdraw2 }) {
            accounts[1].withdraw(w);
        }
        for (BankAccount a : accounts) System.out.println(a);
        System.out.println("Total accounts: " + BankAccount.getTotalAccounts());
    }
}
