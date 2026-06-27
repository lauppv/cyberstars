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
    }

    void printAll() {
    }

    double totalValue() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventory inv = new Inventory();
    }
}
