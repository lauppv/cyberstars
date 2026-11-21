class OutOfStockException extends Exception {
    OutOfStockException(int m) { super("short by " + m); }
}

public class Main {
    static int sell(int stock, int amount) throws OutOfStockException {
        if (amount >= stock) throw new OutOfStockException(amount - stock);
        return stock - amount;
    }

    public static void main(String[] args) {
        int stock = 10;
        int[] orders = {4, 8, 6, 1};
        for (int amount : orders) {
            try {
                stock = sell(stock, amount);
                System.out.println("Sold " + amount + ", " + stock + " left");
            } catch (OutOfStockException e) {
                System.out.println("Sorry, " + e.getMessage());
            }
        }
        System.out.println("Stock left: " + stock);
    }
}
