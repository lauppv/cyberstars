import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        int[] offers = {5000, 9000, 1000, 12000, 7500, 2000};
        int minimum = 7000;
        ArrayList<Integer> list = new ArrayList<>();
        for (int o : offers) list.add(o);
        int gone = 0;
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            Integer o = it.next();
            if (o >= minimum) continue;
            it.remove();
            gone = gone + 1;
        }
        String text = "[";
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) text += ", ";
            text += list.get(i);
        }
        System.out.println("Kept: " + text + "]");
        System.out.println("Removed: " + gone);
    }
}
