class BankAccount {
    private static int nextId = 1;
    private static int created = 0;
    private final int MIN_BALANCE = 0;
    private final String owner;
    private int balance;
    private final int accountId;

    public BankAccount(String who, int start) {
        owner = who;
        balance = start;
        accountId = nextId++;
        created++;
    }

    public String getOwner() { return owner; }
    public int getBalance() { return balance; }
    public int getAccountId() { return accountId; }

    public void deposit(int amount) {
        balance = balance + amount;
    }

    public void withdraw(int amount) {
        if (amount > balance - MIN_BALANCE) {
            System.out.println("Insufficient funds");
            return;
        }
        balance = balance - amount;
    }

    public static int getTotalAccounts() {
        return created;
    }

    @Override
    public String toString() {
        return String.format("Account #%d (%s) - Balance: %d$", accountId, owner, balance);
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

        BankAccount first = new BankAccount(owner1, balance1);
        BankAccount second = new BankAccount(owner2, balance2);
        first.deposit(deposit1);
        second.withdraw(withdraw1);
        second.withdraw(withdraw2);
        System.out.println(first + "\n" + second);
        System.out.println("Total accounts: " + BankAccount.getTotalAccounts());
    }
}
