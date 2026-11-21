import java.util.ArrayList;
import java.util.Comparator;

public class Main {
    public static void main(String[] args) {
        String[] names = {"lance", "Phil", "kent", "CORTEZ"};
        ArrayList<String> calls = new ArrayList<>();
        for (int i = 0; i < names.length; i++) calls.add(names[i].toUpperCase());
        calls.sort(Comparator.naturalOrder());
        calls.forEach(System.out::println);
        System.out.println("Calls to make: " + calls.size());
    }
}
