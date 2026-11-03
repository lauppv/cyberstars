import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int balance = Integer.parseInt(in.nextLine());
        int n = Integer.parseInt(in.nextLine());
        for (int i = 0; i < n; i++) {
            String op = in.nextLine();
            int amount = Integer.parseInt(in.nextLine());
            if (op.equals("deposit")) {
                balance += amount;
            } else if (amount > balance) {
                System.out.println("Insufficient funds");
            } else {
                balance -= amount;
            }
        }
        System.out.println("Balance: " + balance);
    }
}
