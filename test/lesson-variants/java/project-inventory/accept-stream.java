import java.util.ArrayList;
import java.util.List;

class Item {
    final String name;
    final int quantity;
    final double price;

    Item(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    double value() {
        return quantity * price;
    }
}

class Inventory {
    private final List<Item> stock = new ArrayList<>();

    void addItem(Item item) {
        stock.add(item);
    }

    void removeItem(String name) {
        stock.removeIf(i -> i.name.equals(name));
    }

    void printAll() {
        stock.forEach(i -> System.out.printf("%s x%d @ $%.2f%n", i.name, i.quantity, i.price));
    }

    double totalValue() {
        return stock.stream().mapToDouble(Item::value).sum();
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Air filter";
        int quantity1 = 4;
        double price1 = 35.00;
        String name2 = "Food pack";
        int quantity2 = 10;
        double price2 = 12.00;
        String name3 = "Repair kit";
        int quantity3 = 3;
        double price3 = 85.00;

        Inventory bay = new Inventory();
        bay.addItem(new Item(name1, quantity1, price1));
        bay.addItem(new Item(name2, quantity2, price2));
        bay.addItem(new Item(name3, quantity3, price3));
        bay.printAll();
        System.out.printf("Total: $%.2f%n", bay.totalValue());
    }
}
