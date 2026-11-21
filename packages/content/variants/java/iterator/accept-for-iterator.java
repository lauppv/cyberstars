import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;
        List<Integer> pile = new ArrayList<Integer>();
        for (int i = 0; i < offers.length; i++) pile.add(offers[i]);
        int before = pile.size();
        for (Iterator<Integer> it = pile.iterator(); it.hasNext(); ) {
            int value = it.next();
            if (value < minimum) it.remove();
        }
        System.out.println("Kept: " + pile);
        System.out.println("Removed: " + (before - pile.size()));
    }
}
