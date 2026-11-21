import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        String[] names = {"lance", "Phil", "kent", "CORTEZ"};
        ArrayList<String> calls = new ArrayList<>();
        for (String name : names) calls.add(name.toUpperCase());
        Collections.sort(calls);
        for (String call : calls) System.out.println(call);
        System.out.println("Calls to make: " + calls.size());
    }
}
