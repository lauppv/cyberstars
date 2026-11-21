import java.util.ArrayList;
import java.util.Collections;

class Shelf<T extends Comparable<T>> {
    private final ArrayList<T> items = new ArrayList<>();
    void add(T item) { items.add(item); }
    int size() { return items.size(); }
    T smallest() {
        T best = null;
        for (T item : items) if (best == null || item.compareTo(best) < 0) best = item;
        return best;
    }
    T largest() {
        ArrayList<T> copy = new ArrayList<>(items);
        Collections.sort(copy);
        return copy.get(copy.size() - 1);
    }
}

public class Main {
    static <T extends Comparable<T>> String report(String label, Shelf<T> shelf) {
        return shelf.size() == 0 ? label + ": empty"
            : String.format("%s: %d items, smallest %s, largest %s", label, shelf.size(), shelf.smallest(), shelf.largest());
    }

    public static void main(String[] args) {
        String[] names = { "Tommy", "Ken", "Lance" };
        Integer[] weights = { 12, 5, 30 };
        Shelf<String> a = new Shelf<>();
        Shelf<Integer> b = new Shelf<>();
        for (int i = 0; i < names.length; i++) a.add(names[i]);
        for (int i = 0; i < weights.length; i++) b.add(weights[i]);
        System.out.println(report("Names", a));
        System.out.println(report("Weights", b));
    }
}
