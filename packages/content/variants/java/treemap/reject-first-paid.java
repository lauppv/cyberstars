import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Vic", "Tommy", "Lance"};
        int[] amounts = {4000, 1000, 500, 3000, 2000};
        TreeMap<String, Integer> book = new TreeMap<>();
        for (int i = 0; i < names.length; i++) {
            book.put(names[i], book.getOrDefault(names[i], 0) + amounts[i]);
        }
        for (String name : book.keySet()) System.out.println(name + ": " + book.get(name));
        System.out.println("First: " + names[0]);
        System.out.println("Last: " + names[names.length - 1]);
    }
}
