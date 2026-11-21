import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;
        ArrayList<Integer> list = new ArrayList<>();
        for (int o : offers) list.add(o);
        Iterator<Integer> unused = list.iterator();
        unused.hasNext();
        int removed = 0;
        for (Integer o : list) {
            if (o < minimum) {
                list.remove(o);
                removed++;
            }
        }
        System.out.println("Kept: " + list);
        System.out.println("Removed: " + removed);
    }
}
