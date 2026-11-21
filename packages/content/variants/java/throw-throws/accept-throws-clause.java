public class Main {
    static int withdraw(int from, int take) throws IllegalArgumentException {
        if (take < 1) throw new IllegalArgumentException("Amount must be positive");
        else if (from - take < 0) throw new IllegalArgumentException("Not enough money");
        return from - take;
    }

    public static void main(String[] args) {
        int balance = 1000;
        int[] withdrawals = {300, 5000, -20, 700};
        int i = 0;
        while (i < withdrawals.length) {
            int w = withdrawals[i++];
            try {
                int after = withdraw(balance, w);
                balance = after;
                System.out.println("Took " + w + ", left " + after);
            } catch (RuntimeException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        System.out.println("Balance: " + balance);
    }
}
