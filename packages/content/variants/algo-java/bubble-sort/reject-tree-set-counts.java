import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Map<Integer, Integer> counts = new HashMap<>();
        TreeSet<Integer> keys = new TreeSet<>();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 1; j++) {
                int x = in.nextInt();
                counts.merge(x, 1, Integer::sum);
                keys.add(x);
            }
        }
        StringBuilder out = new StringBuilder();
        for (int x : keys) {
            for (int k = 0; k < counts.get(x); k++) out.append(out.length() > 0 ? " " : "").append(x);
        }
        System.out.println(out);
    }
}
