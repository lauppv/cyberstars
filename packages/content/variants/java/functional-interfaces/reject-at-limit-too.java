import java.util.function.Function;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        int[] prices = {20000, 100000, 50000, 60000};
        int limit = 50000;
        int percent = 20;
        Predicate<Integer> aboveLimit = p -> p >= limit;
        Function<Integer, Integer> sale = p -> p - p * percent / 100;
        int total = 0;
        for (int price : prices) {
            if (aboveLimit.test(price)) {
                System.out.println(price + " -> " + sale.apply(price));
                total += sale.apply(price);
            } else {
                System.out.println(price + " stays");
                total += price;
            }
        }
        System.out.println("Total: " + total);
    }
}
