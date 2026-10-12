public class Main {
    static class Wallet {
        private int money;

        public Wallet(int money) {
            this.money = money;
        }

        private boolean canSpend(int amount) {
            return amount > 0 && money - amount >= 0;
        }

        public void addMoney(int amount) {
            money += Math.max(amount, 0);
        }

        public void spendMoney(int amount) {
            money -= canSpend(amount) ? amount : 0;
        }

        public int getBalance() {
            return money;
        }
    }

    public static void main(String[] args) {
        int start = 100;
        int income = 50;
        int spend1 = 30;
        int spend2 = 200;
        Wallet w = new Wallet(start);
        w.addMoney(income);
        w.spendMoney(spend1);
        w.spendMoney(spend2);
        System.out.println(String.valueOf(w.getBalance()));
    }
}
