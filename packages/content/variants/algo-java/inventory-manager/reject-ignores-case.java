import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        Map<String, Integer> stock = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            String shown = in.nextLine();
            String item = shown.toLowerCase();
            int have = stock.getOrDefault(item, 0);
            if (cmd.equals("check")) {
                System.out.println(shown + ": " + have);
                continue;
            }
            int qty = Integer.parseInt(in.nextLine());
            if (cmd.equals("add")) stock.put(item, have + qty);
            else if (qty > have) System.out.println("Not enough " + shown);
            else stock.put(item, have - qty);
        }
        int left = 0;
        for (int q : stock.values()) if (q > 0) left++;
        System.out.println("Items: " + left);
    }
}
