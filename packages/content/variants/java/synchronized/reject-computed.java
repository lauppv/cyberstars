class Vault {
    int balance = 0;
    int count = 0;
    synchronized void deposit(int amount) { balance += amount; count++; }
}

public class Main {
    public static void main(String[] args) {
        int tellers = 4;
        int deposits = 1000;
        int amount = 10;
        Vault vault = new Vault();
        System.out.println("Deposits made: " + tellers * deposits);
        System.out.println("Balance: " + tellers * deposits * amount);
    }
}
