import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Vic", "Tommy", "Lance"};
        int[] amounts = {4000, 1000, 500, 3000, 2000};
        TreeMap<String, Integer> book = new TreeMap<>();
        for (int i = 0; i < names.length; i++) book.merge(names[i], amounts[i], Integer::sum);
        book.forEach((who, total) -> System.out.println(who + ": " + total));
        System.out.println("First: " + book.firstKey() + "\nLast: " + book.lastKey());
    }
}
