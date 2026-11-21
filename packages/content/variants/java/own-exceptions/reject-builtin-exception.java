public class Main {
    static int sell(int stock, int amount) throws Exception {
        if (amount > stock) throw new Exception("short by " + (amount - stock));
        return stock - amount;
    }

    public static void main(String[] args) {
        int stock = 10;
        int[] orders = {4, 8, 6, 1};
        for (int amount : orders) {
            try {
                stock = sell(stock, amount);
                System.out.println("Sold " + amount + ", " + stock + " left");
            } catch (Exception e) {
                System.out.println("Sorry, " + e.getMessage());
            }
        }
        System.out.println("Stock left: " + stock);
    }
}
