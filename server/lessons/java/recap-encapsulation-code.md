class BankAccount {
    // fields, constructor, methods
}

public class Main {
    public static void main(String[] args) {
        BankAccount a1 = new BankAccount("Tommy", 1000);
        BankAccount a2 = new BankAccount("Lance", 500);

        a1.deposit(250);
        a2.withdraw(200);
        a2.withdraw(400);

        System.out.println(a1);
        System.out.println(a2);
        System.out.println("Total accounts: " + BankAccount.getTotalAccounts());
    }
}
