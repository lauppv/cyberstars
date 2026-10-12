import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        int count1 = 47;
        int count2 = 12;
        int count3 = 8;
        int count4 = 23;

        Map<String, Integer> log = new LinkedHashMap<>();
        log.put("Tommy", count1);
        log.put("Lance", count2);
        log.put("Phil", count3);
        log.put("Mercedes", count4);

        for (Map.Entry<String, Integer> e : log.entrySet()) {
            if (e.getValue() > 15) System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}
