import java.math.*;
import java.util.*;

class Item {
    private final BigDecimal price;
    private final int quantity;

    Item(String price, int quantity) {
        this.price = new BigDecimal(price);
        this.quantity = quantity;
    }

    BigDecimal getTotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine().trim());
        BigDecimal sum = BigDecimal.ZERO;
        for (int i = 0; i < n; i++) {
            in.nextLine();
            String price = in.nextLine().trim();
            sum = sum.add(new Item(price, Integer.parseInt(in.nextLine().trim())).getTotal());
        }
        System.out.println("Total: " + sum.setScale(2, RoundingMode.HALF_UP));
    }
}
