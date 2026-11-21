import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;
        ArrayList<Integer> list = new ArrayList<>();
        Iterator<Integer> it = list.iterator();
        it.hasNext();
        for (int o : offers) list.add(o);
        int removed = 0;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) < minimum) {
                list.remove(i);
                removed++;
            }
        }
        System.out.println("Kept: " + list);
        System.out.println("Removed: " + removed);
    }
}
