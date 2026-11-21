```java
public class Main {
    static int withdraw(int balance, int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (amount > balance) {
            throw new IllegalArgumentException("Not enough money");
        }
        return balance - amount;
    }

    public static void main(String[] args) {
        int balance = 1000;
        int[] withdrawals = {300, 5000, -20, 700};

        for (int amount : withdrawals) {
            try {
                balance = withdraw(balance, amount);
                System.out.println("Took " + amount + ", left " + balance);
            } catch (IllegalArgumentException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        System.out.println("Balance: " + balance);
    }
}
```
