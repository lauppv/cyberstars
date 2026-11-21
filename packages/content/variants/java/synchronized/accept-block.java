class Vault {
    private int balance;
    private int count;
    private final Object lock = new Object();

    void deposit(int amount) {
        synchronized (lock) {
            balance = balance + amount;
            count = count + 1;
        }
    }

    int balance() { synchronized (lock) { return balance; } }
    int count() { synchronized (lock) { return count; } }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        int tellers = 4;
        int deposits = 1000;
        int amount = 10;
        Vault vault = new Vault();
        java.util.ArrayList<Thread> all = new java.util.ArrayList<>();
        for (int i = 0; i < tellers; i++) {
            Thread t = new Thread(() -> {
                for (int d = 0; d < deposits; d++) vault.deposit(amount);
            });
            all.add(t);
            t.start();
        }
        for (Thread t : all) t.join();
        System.out.println("Deposits made: " + vault.count());
        System.out.println("Balance: " + vault.balance());
    }
}
