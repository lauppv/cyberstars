import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        String[] places = {"Malibu Club", "Pole Position", "Malibu Club", "Print Works"};
        int[] amounts = {5000, 3000, 7000, 1500};
        List<Integer> money = new ArrayList<>();
        List<String> where = new ArrayList<>();
        for (int i = 0; i < places.length; i++) { money.add(amounts[i]); where.add(places[i]); }
        int total = money.stream().reduce(0, (a, b) -> a + b);
        int top = money.stream().reduce(Integer.MIN_VALUE, (a, b) -> a > b ? a : b);
        Set<String> sorted = where.stream().collect(Collectors.toCollection(TreeSet::new));
        System.out.println("Total: " + total);
        System.out.println("Biggest: " + top);
        System.out.println("Places: " + String.join(", ", sorted));
    }
}
