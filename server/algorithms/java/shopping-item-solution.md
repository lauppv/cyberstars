```java
import java.util.Scanner;

class ShoppingItem {
    private final String name;
    private final double price;
    private final int quantity;

    ShoppingItem(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    double getTotal() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        double grandTotal = 0;
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            String name = parts[0];
            double price = Double.parseDouble(parts[1]);
            int quantity = Integer.parseInt(parts[2]);
            ShoppingItem item = new ShoppingItem(name, price, quantity);
            grandTotal += item.getTotal();
        }
        System.out.printf("Total: %.2f%n", grandTotal);
    }
}
```
