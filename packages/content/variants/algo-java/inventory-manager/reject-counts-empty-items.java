import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        Map<String, Integer> stock = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            String item = in.nextLine();
            int have = stock.getOrDefault(item, 0);
            if (cmd.equals("check")) {
                System.out.println(item + ": " + have);
                continue;
            }
            int qty = Integer.parseInt(in.nextLine());
            if (cmd.equals("add")) stock.put(item, have + qty);
            else if (qty > have) System.out.println("Not enough " + item);
            else stock.put(item, have - qty);
        }
        System.out.println("Items: " + stock.size());
    }
}
