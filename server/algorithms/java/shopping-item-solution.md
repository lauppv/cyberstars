```java
import java.util.Scanner;

class Item {
    private final String name;
    private final double price;
    private final int quantity;

    Item(String name, double price, int quantity) {
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

        int n = Integer.parseInt(sc.nextLine());

        double grandTotal = 0;

        for (int i = 0; i < n; i++) {
            String name = sc.nextLine();
            double price = Double.parseDouble(sc.nextLine());
            int quantity = Integer.parseInt(sc.nextLine());

            Item item = new Item(name, price, quantity);
            grandTotal = grandTotal + item.getTotal();
        }

        System.out.printf("Total: %.2f%n", grandTotal);
    }
}
```
