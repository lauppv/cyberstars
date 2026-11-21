public class Main {
    public static void main(String[] args) {
        int[] prices = {20000, 100000, 50000, 60000};
        int limit = 50000;
        int percent = 20;
        int total = 0;
        for (int price : prices) {
            if (price > limit) {
                int n = price - price * percent / 100;
                System.out.println(price + " -> " + n);
                total += n;
            } else {
                System.out.println(price + " stays");
                total += price;
            }
        }
        System.out.println("Total: " + total);
    }
}
