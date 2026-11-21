import java.util.ArrayList;

class Shelf<T extends Comparable<T>> {
    ArrayList<T> items = new ArrayList<>();
    void add(T item) { items.add(item); }
    int size() { return items.size(); }
    T smallest() {
        T min = items.get(0);
        for (T item : items) if (item.toString().compareTo(min.toString()) < 0) min = item;
        return min;
    }
    T largest() {
        T max = items.get(0);
        for (T item : items) if (item.toString().compareTo(max.toString()) > 0) max = item;
        return max;
    }
}

public class Main {
    static <T extends Comparable<T>> String report(String label, Shelf<T> shelf) {
        if (shelf.size() == 0) return label + ": empty";
        return label + ": " + shelf.size() + " items, smallest " + shelf.smallest() + ", largest " + shelf.largest();
    }

    public static void main(String[] args) {
        String[] names = { "Tommy", "Ken", "Lance" };
        Integer[] weights = { 12, 5, 30 };
        Shelf<String> nameShelf = new Shelf<>();
        for (String name : names) nameShelf.add(name);
        Shelf<Integer> weightShelf = new Shelf<>();
        for (Integer weight : weights) weightShelf.add(weight);
        System.out.println(report("Names", nameShelf));
        System.out.println(report("Weights", weightShelf));
    }
}
