public class Main {
    static int withdraw(int balance, int amount) {
        if (amount <= 0) return -1;
        if (amount > balance) return -2;
        return balance - amount;
    }

    public static void main(String[] args) {
        int balance = 1000;
        int[] withdrawals = {300, 5000, -20, 700};
        for (int w : withdrawals) {
            try {
                int r = withdraw(balance, w);
                if (r == -1) System.out.println("Refused: Amount must be positive");
                else if (r == -2) System.out.println("Refused: Not enough money");
                else { balance = r; System.out.println("Took " + w + ", left " + balance); }
            } catch (RuntimeException e) {
                System.out.println("?");
            }
        }
        System.out.println("Balance: " + balance);
    }
}
