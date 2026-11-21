import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] names = {"lance", "Phil", "kent", "CORTEZ"};
        ArrayList<String> calls = new ArrayList<>();
        for (String name : names) calls.add(name);
        calls.sort(String::compareTo);
        calls.replaceAll(String::toUpperCase);
        calls.forEach(System.out::println);
        System.out.println("Calls to make: " + calls.size());
    }
}
