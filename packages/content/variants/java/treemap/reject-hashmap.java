import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        String[] names = {"Tommy", "Lance", "Vic", "Tommy", "Lance"};
        int[] amounts = {4000, 1000, 500, 3000, 2000};
        HashMap<String, Integer> book = new HashMap<>();
        for (int i = 0; i < names.length; i++) {
            book.put(names[i], book.getOrDefault(names[i], 0) + amounts[i]);
        }
        ArrayList<String> keys = new ArrayList<>(book.keySet());
        Collections.sort(keys);
        for (String k : keys) System.out.println(k + ": " + book.get(k));
        System.out.println("First: " + keys.get(0));
        System.out.println("Last: " + keys.get(keys.size() - 1));
    }
}
