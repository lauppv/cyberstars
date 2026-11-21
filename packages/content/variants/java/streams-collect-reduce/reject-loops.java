import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        String[] places = {"Malibu Club", "Pole Position", "Malibu Club", "Print Works"};
        int[] amounts = {5000, 3000, 7000, 1500};
        int total = 0, max = 0;
        TreeSet<String> names = new TreeSet<>();
        for (int i = 0; i < places.length; i++) {
            total += amounts[i];
            max = Math.max(max, amounts[i]);
            names.add(places[i]);
        }
        System.out.println("Total: " + total);
        System.out.println("Biggest: " + max);
        System.out.println("Places: " + String.join(", ", names));
    }
}
