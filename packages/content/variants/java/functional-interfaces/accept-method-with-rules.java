import java.util.function.*;

public class Main {
    static int run(int[] prices, Predicate<Integer> discounted, Function<Integer, Integer> cut) {
        int sum = 0;
        for (int i = 0; i < prices.length; i++) {
            int p = prices[i];
            int after = discounted.test(p) ? cut.apply(p) : p;
            System.out.println(after == p && !discounted.test(p) ? p + " stays" : p + " -> " + after);
            sum += after;
        }
        return sum;
    }

    public static void main(String[] args) {
        int[] prices = {20000, 100000, 50000, 60000};
        int limit = 50000;
        int percent = 20;
        System.out.println("Total: " + run(prices, x -> x > limit, x -> x - x * percent / 100));
    }
}
