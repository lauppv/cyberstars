import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    static String best(ArrayList<String> items) { return Collections.max(items); }
    static int bestScore(ArrayList<Integer> items) { return Collections.max(items); }

    static double total(ArrayList<? extends Number> values) {
        double sum = 0;
        for (Number v : values) sum += v.doubleValue();
        return sum;
    }

    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>(List.of("Tommy", "Ken", "Lance"));
        ArrayList<Integer> scores = new ArrayList<>(List.of(120, 85, 40));
        ArrayList<Double> times = new ArrayList<>(List.of(61.5, 58.25));
        System.out.println("Last name: " + best(names));
        System.out.println("Top score: " + bestScore(scores));
        System.out.println("Score total: " + total(scores));
        System.out.println("Time total: " + total(times));
    }
}
