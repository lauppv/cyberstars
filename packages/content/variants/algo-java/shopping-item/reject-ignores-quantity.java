import java.util.*;

class Item {
    private final double price;

    Item(double price) {
        this.price = price;
    }

    double getTotal() {
        return price;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        double total = 0;
        for (int i = 0; i < n; i++) {
            in.nextLine();
            Item item = new Item(Double.parseDouble(in.nextLine()));
            in.nextLine();
            total += item.getTotal();
        }
        System.out.printf("Total: %.2f%n", total);
    }
}
