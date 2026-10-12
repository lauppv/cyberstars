import java.util.HashMap;

public class Main {
    static final int LIMIT = 15;

    static boolean veteran(int missions) {
        return missions > LIMIT;
    }

    public static void main(String[] args) {
        int count1 = 47, count2 = 12, count3 = 8, count4 = 23;
        HashMap<String, Integer> crew = new HashMap<>();
        String[] names = { "Tommy", "Lance", "Phil", "Mercedes" };
        int[] counts = { count1, count2, count3, count4 };
        for (int i = 0; i < names.length; i++) {
            crew.put(names[i], counts[i]);
        }
        for (String who : crew.keySet()) {
            if (veteran(crew.get(who))) {
                System.out.println(who + ": " + crew.get(who));
            }
        }
    }
}
