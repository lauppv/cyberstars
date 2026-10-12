```java
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Map<String, Integer> inventory = new HashMap<>();

        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine();
            String item = sc.nextLine();

            if (cmd.equals("add")) {
                int qty = Integer.parseInt(sc.nextLine());

                // If the item already exists, increase the quantity; otherwise add it.
                if (inventory.containsKey(item)) {
                    inventory.put(item, inventory.get(item) + qty);
                } else {
                    inventory.put(item, qty);
                }
            } else if (cmd.equals("remove")) {
                int qty = Integer.parseInt(sc.nextLine());

                int current = 0;
                if (inventory.containsKey(item)) {
                    current = inventory.get(item);
                }

                if (qty > current) {
                    System.out.println("Not enough " + item);
                } else {
                    inventory.put(item, current - qty);
                }
            } else {
                int qty = 0;
                if (inventory.containsKey(item)) {
                    qty = inventory.get(item);
                }
                System.out.println(item + ": " + qty);
            }
        }

        // Count items with a strictly positive quantity.
        int count = 0;
        for (int qty : inventory.values()) {
            if (qty > 0) {
                count = count + 1;
            }
        }
        System.out.println("Items: " + count);
    }
}
```
