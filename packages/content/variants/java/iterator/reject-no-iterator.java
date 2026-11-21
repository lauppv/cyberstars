import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;
        ArrayList<Integer> kept = new ArrayList<>();
        int removed = 0;
        for (int o : offers) {
            if (o < minimum) removed++;
            else kept.add(o);
        }
        System.out.println("Kept: " + kept);
        System.out.println("Removed: " + removed);
    }
}
