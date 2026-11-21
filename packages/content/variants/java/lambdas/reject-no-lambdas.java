import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        int[] prices = {32000, 120000, 9000, 45000, 60000, 32000};
        int budget = 50000;
        ArrayList<Integer> cars = new ArrayList<>();
        for (int p : prices) if (p <= budget) cars.add(p);
        Collections.sort(cars, Collections.reverseOrder());
        for (int p : cars) System.out.println("$" + p);
        System.out.println("Options: " + cars.size());
    }
}
