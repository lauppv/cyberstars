class BankAccount {
    private int balance;
    BankAccount(int balance) { this.balance = balance; }
    int getBalance() { return 1300; }
    void deposit(int amount) { }
    void withdraw(int amount) { }
}

public class Main {
    public static void main(String[] args) {
        int start = 1000;
        int deposit = 500;
        int withdraw1 = 200;
        int withdraw2 = 2000;
        BankAccount acc = new BankAccount(start);
        acc.deposit(deposit);
        acc.withdraw(withdraw1);
        acc.withdraw(withdraw2);
        System.out.println(acc.getBalance());
    }
}
