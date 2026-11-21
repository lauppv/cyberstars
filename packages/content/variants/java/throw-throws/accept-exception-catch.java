public class Main {
    static int withdraw(int balance, int amount) {
        if (amount > balance && amount > 0) throw new IllegalArgumentException("Not enough money");
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        return balance - amount;
    }

    public static void main(String[] args) {
        int balance = 1000;
        int[] withdrawals = {300, 5000, -20, 700};
        for (int w : withdrawals) {
            try {
                balance = withdraw(balance, w);
                System.out.printf("Took %d, left %d%n", w, balance);
            } catch (Exception problem) {
                System.out.println("Refused: " + problem.getMessage());
            }
        }
        System.out.println("Balance: " + balance);
    }
}
