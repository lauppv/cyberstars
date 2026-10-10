import java.util.ArrayList;

class Item {
    String name;
    int quantity;
    double price;
    Item(String name, int quantity, double price) { this.name = name; this.quantity = quantity; this.price = price; }
}

class Inventory {
    ArrayList<Item> items = new ArrayList<>();
    void addItem(Item item) { items.add(item); }
    void removeItem(String name) {}
    void printAll() {
        for (Item i : items) System.out.println(i.name + " x" + i.quantity + " @ $" + i.price);
    }
    double totalValue() {
        double t = 0;
        for (Item i : items) t += i.quantity * i.price;
        return t;
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
        Inventory inv = new Inventory();
        inv.addItem(new Item(name1, quantity1, price1));
        inv.addItem(new Item(name2, quantity2, price2));
        inv.addItem(new Item(name3, quantity3, price3));
        inv.printAll();
        System.out.println("Total: $" + String.format("%.2f", inv.totalValue()));
    }
}
