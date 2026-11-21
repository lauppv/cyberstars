import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] names = {"lance", "Phil", "kent", "CORTEZ"};
        List<String> list = new ArrayList<String>(Arrays.asList(names));
        list.replaceAll(String::toUpperCase);
        Collections.sort(list);
        for (String s : list) System.out.println(s);
        System.out.println("Calls to make: " + list.size());
    }
}
