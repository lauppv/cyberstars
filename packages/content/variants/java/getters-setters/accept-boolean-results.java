public class Main {
    static class BankAccount {
        private int balance;

        BankAccount(int balance) {
            this.balance = balance;
        }

        public int getBalance() {
            return balance;
        }

        public boolean deposit(int amount) {
            boolean ok = amount > 0;
            if (ok) balance = balance + amount;
            return ok;
        }

        public boolean withdraw(int amount) {
            boolean ok = amount > 0 && balance >= amount;
            if (ok) balance = balance - amount;
            return ok;
        }
    }

    public static void main(String[] args) {
        int start = 1000;
        int deposit = 500;
        int withdraw1 = 200;
        int withdraw2 = 2000;
        BankAccount acc = new BankAccount(start);
        acc.deposit(deposit);
        acc.withdraw(withdraw1);
        acc.withdraw(withdraw2);
        System.out.printf("%d%n", acc.getBalance());
    }
}
