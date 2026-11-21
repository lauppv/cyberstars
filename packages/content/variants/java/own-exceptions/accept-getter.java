public class Main {
    static class OutOfStockException extends Exception {
        private final int short_;
        OutOfStockException(int shortBy) {
            super("short by " + shortBy);
            short_ = shortBy;
        }
        int getShort() { return short_; }
    }

    static int sell(int stock, int amount) throws OutOfStockException {
        int left = stock - amount;
        if (left < 0) throw new OutOfStockException(-left);
        return left;
    }

    public static void main(String[] args) {
        int stock = 10;
        int[] orders = {4, 8, 6, 1};
        for (int i = 0; i < orders.length; i++) {
            try {
                stock = sell(stock, orders[i]);
                System.out.println("Sold " + orders[i] + ", " + stock + " left");
            } catch (OutOfStockException e) {
                System.out.println("Sorry, short by " + e.getShort());
            }
        }
        System.out.println("Stock left: " + stock);
    }
}
