import java.util.*;

class BankAccount {
    long balance;

    BankAccount(long start) {
        balance = start;
    }

    void deposit(long amount) {
        balance += amount;
    }

    String withdraw(long amount) {
        if (amount > balance) return "Insufficient funds";
        balance -= amount;
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        BankAccount account = new BankAccount(in.nextLong());
        int ops = in.nextInt();
        while (ops-- > 0) {
            String kind = in.next();
            long amount = in.nextLong();
            if (kind.equals("deposit")) {
                account.deposit(amount);
            } else {
                String problem = account.withdraw(amount);
                if (problem != null) System.out.println(problem);
            }
        }
        System.out.println("Balance: " + account.balance);
    }
}
