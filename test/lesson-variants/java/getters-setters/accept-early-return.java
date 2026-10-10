class BankAccount {
    private int funds;

    BankAccount(int opening) {
        funds = opening;
    }

    int getBalance() {
        return funds;
    }

    void deposit(int amount) {
        if (amount <= 0) {
            return;
        }
        funds += amount;
    }

    void withdraw(int amount) {
        if (amount <= 0 || amount > funds) {
            return;
        }
        funds -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        int start = 1000;
        int deposit = 500;
        int withdraw1 = 200;
        int withdraw2 = 2000;
        BankAccount tommy = new BankAccount(start);
        tommy.deposit(deposit);
        for (int w : new int[] {withdraw1, withdraw2}) {
            tommy.withdraw(w);
        }
        System.out.println("" + tommy.getBalance());
    }
}
