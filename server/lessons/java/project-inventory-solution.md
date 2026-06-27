```java
import java.util.ArrayList;

class Item {
    String name;
    int quantity;
    double price;

    Item(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}

class Inventory {
    ArrayList<Item> items;

    Inventory() {
        items = new ArrayList<>();
    }

    void addItem(Item item) {
        items.add(item);
    }

    void removeItem(String name) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).name.equals(name)) {
                items.remove(i);
                return;
            }
        }
    }

    void printAll() {
        for (Item item : items) {
            System.out.println(item.name + " x" + item.quantity + " @ $" + String.format("%.2f", item.price));
        }
    }

    double totalValue() {
        double total = 0;
        for (Item item : items) {
            total += item.quantity * item.price;
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventory inv = new Inventory();
        inv.addItem(new Item("Air filter", 4, 35.00));
        inv.addItem(new Item("Food pack", 10, 12.00));
        inv.addItem(new Item("Repair kit", 3, 85.00));

        inv.printAll();
        System.out.println("Total: $" + String.format("%.2f", inv.totalValue()));
    }
}
```
