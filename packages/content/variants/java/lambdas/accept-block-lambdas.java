import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] prices = {32000, 120000, 9000, 45000, 60000, 32000};
        int budget = 50000;
        List<Integer> lot = new ArrayList<Integer>();
        for (int i = 0; i < prices.length; i++) lot.add(prices[i]);
        lot.removeIf((Integer p) -> {
            return p > budget;
        });
        lot.sort((x, y) -> Integer.compare(y, x));
        for (int p : lot) System.out.println("$" + p);
        System.out.println("Options: " + lot.size());
    }
}
