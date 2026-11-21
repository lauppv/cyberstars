import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class Main {
    public static void main(String[] args) {
        int[] prices = {20000, 100000, 50000, 60000};
        int limit = 50000;
        int percent = 20;
        Predicate<Integer> big = (Integer p) -> {
            return p > limit;
        };
        Function<Integer, Integer> off = p -> p - (p * percent) / 100;
        int[] total = {0};
        Consumer<Integer> handle = p -> {
            if (big.test(p)) {
                System.out.println(p + " -> " + off.apply(p));
                total[0] += off.apply(p);
            } else {
                System.out.println(p + " stays");
                total[0] += p;
            }
        };
        for (int p : prices) handle.accept(p);
        System.out.println("Total: " + total[0]);
    }
}
