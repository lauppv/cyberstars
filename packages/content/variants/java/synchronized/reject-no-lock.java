class Vault {
    int balance = 0;
    int count = 0;
    void deposit(int amount) { balance += amount; count++; }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        int tellers = 4;
        int deposits = 1000;
        int amount = 10;
        Vault vault = new Vault();
        Thread[] threads = new Thread[tellers];
        for (int i = 0; i < tellers; i++) {
            threads[i] = new Thread(() -> { for (int d = 0; d < deposits; d++) vault.deposit(amount); });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("Deposits made: " + vault.count);
        System.out.println("Balance: " + vault.balance);
    }
}
