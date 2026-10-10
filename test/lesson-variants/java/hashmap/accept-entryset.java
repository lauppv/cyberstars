import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        int count1 = 47;
        int count2 = 12;
        int count3 = 8;
        int count4 = 23;

        Map<String, Integer> log = new HashMap<>();
        log.put("Tommy", count1);
        log.put("Lance", count2);
        log.put("Phil", count3);
        log.put("Mercedes", count4);

        for (Map.Entry<String, Integer> e : log.entrySet()) {
            int done = e.getValue();
            if (done > 15) {
                System.out.println(e.getKey() + ": " + done);
            }
        }
    }
}
