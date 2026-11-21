import java.util.ArrayList;
import java.util.List;

public class Main {
    static <T extends Comparable<T>> T best(ArrayList<T> items) {
        T top = null;
        for (T item : items) {
            if (top == null || item.compareTo(top) > 0) top = item;
        }
        return top;
    }

    static <N extends Number> double total(ArrayList<N> values) {
        double sum = 0;
        for (int i = 0; i < values.size(); i++) sum += values.get(i).doubleValue();
        return sum;
    }

    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>(List.of("Tommy", "Ken", "Lance"));
        ArrayList<Integer> scores = new ArrayList<>(List.of(120, 85, 40));
        ArrayList<Double> times = new ArrayList<>(List.of(61.5, 58.25));
        System.out.println("Last name: " + best(names));
        System.out.println("Top score: " + best(scores));
        System.out.println("Score total: " + total(scores));
        System.out.println("Time total: " + total(times));
    }
}
