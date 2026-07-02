```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Map<String, Integer> inventory = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            String cmd = parts[0];
            String item = parts[1];
            if (cmd.equals("add")) {
                int qty = Integer.parseInt(parts[2]);
                inventory.merge(item, qty, Integer::sum);
            } else if (cmd.equals("remove")) {
                int qty = Integer.parseInt(parts[2]);
                int current = inventory.getOrDefault(item, 0);
                if (qty > current) {
                    System.out.println("Not enough " + item);
                } else {
                    inventory.put(item, current - qty);
                }
            } else if (cmd.equals("check")) {
                int qty = inventory.getOrDefault(item, 0);
                System.out.println(item + ": " + qty);
            }
        }
        int count = 0;
        for (int qty : inventory.values()) {
            if (qty > 0) {
                count++;
            }
        }
        System.out.println("Items: " + count);
    }
}
```
