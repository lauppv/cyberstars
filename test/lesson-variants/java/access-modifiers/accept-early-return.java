class Wallet {
    private int cash;

    public Wallet(int initial) {
        cash = initial;
    }

    public void addMoney(int amount) {
        if (amount <= 0) return;
        cash = cash + amount;
    }

    public void spendMoney(int amount) {
        if (amount <= 0) return;
        if (amount > cash) return;
        cash = cash - amount;
    }

    public int getBalance() {
        return cash;
    }
}

public class Main {
    public static void main(String[] args) {
        int start = 100;
        int income = 50;
        int spend1 = 30;
        int spend2 = 200;

        Wallet tommy = new Wallet(start);
        tommy.addMoney(income);
        int[] tries = {spend1, spend2};
        for (int t : tries) {
            tommy.spendMoney(t);
        }
        System.out.print(tommy.getBalance() + "\n");
    }
}
