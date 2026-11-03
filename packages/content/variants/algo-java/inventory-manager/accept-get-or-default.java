import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Map<String, Integer> stock = new HashMap<>();
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String cmd = in.next();
            String item = in.next();
            int have = stock.getOrDefault(item, 0);
            if (cmd.equals("check")) {
                out.append(item).append(": ").append(have).append('\n');
                continue;
            }
            int qty = in.nextInt();
            if (cmd.equals("add")) stock.merge(item, qty, Integer::sum);
            else if (qty > have) out.append("Not enough ").append(item).append('\n');
            else stock.put(item, have - qty);
        }
        long left = stock.values().stream().filter(q -> q > 0).count();
        System.out.print(out);
        System.out.println("Items: " + left);
    }
}
