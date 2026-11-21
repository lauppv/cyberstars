class OutOfStockException extends Exception {
    OutOfStockException(String m) { super(m); }
}

public class Main {
    static int sell(int stock, int amount) throws OutOfStockException {
        if (stock >= amount) return stock - amount;
        throw new OutOfStockException("short by " + (amount - stock));
    }

    public static void main(String[] args) throws Exception {
        int stock = 10;
        int[] orders = {4, 8, 6, 1};
        for (int amount : orders) {
            try {
                int left = sell(stock, amount);
                System.out.println("Sold " + amount + ", " + left + " left");
                stock = left;
            } catch (Exception e) {
                System.out.println("Sorry, " + e.getMessage());
            }
        }
        System.out.println("Stock left: " + stock);
    }
}
