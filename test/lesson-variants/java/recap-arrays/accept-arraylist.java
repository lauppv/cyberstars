import java.util.ArrayList;
import java.util.List;

public class Main {
    static String[] clean(String[] feed) {
        List<String> kept = new ArrayList<>();
        for (String s : feed) {
            if (s.equals("out")) break;
            if (s.equals("static")) continue;
            kept.add(s.toUpperCase());
        }
        return kept.toArray(new String[0]);
    }

    public static void main(String[] args) {
        String[] signals = { "tommy", "static", "lance", "out", "mercedes" };
        String[] names = clean(signals);
        for (String n : names) System.out.println(n);
        System.out.println("Total: " + names.length);
    }
}
