import java.util.ArrayList;

class Shelf {
    ArrayList<String> items = new ArrayList<>();
    void add(String item) { items.add(item); }
}

public class Main {
    static String report(String label, ArrayList<? extends Comparable> items) {
        return label;
    }

    public static void main(String[] args) {
        String[] names = { "Tommy", "Ken", "Lance" };
        Integer[] weights = { 12, 5, 30 };
        String minN = null, maxN = null;
        for (String n : names) {
            if (minN == null || n.compareTo(minN) < 0) minN = n;
            if (maxN == null || n.compareTo(maxN) > 0) maxN = n;
        }
        Integer minW = null, maxW = null;
        for (Integer w : weights) {
            if (minW == null || w < minW) minW = w;
            if (maxW == null || w > maxW) maxW = w;
        }
        System.out.println(names.length == 0 ? "Names: empty" : "Names: " + names.length + " items, smallest " + minN + ", largest " + maxN);
        System.out.println(weights.length == 0 ? "Weights: empty" : "Weights: " + weights.length + " items, smallest " + minW + ", largest " + maxW);
    }
}
