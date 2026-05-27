import java.util.ArrayList;

class Item {
String name;
int quantity;
double price;

    // Constructor that takes name, quantity, price

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
        // Loop through items, find by name, remove it

    }

    void printAll() {
        // Print each item as: name xQuantity @ $price
        // Use String.format("%.2f", price) for the price

    }

    double totalValue() {
        // Return the sum of quantity * price for all items
        return 0;
    }

}

public class Main {
public static void main(String[] args) {
Inventory inv = new Inventory();

        // Add: "Shotgun" x2 @ $350.00
        // Add: "Medkit" x10 @ $15.50
        // Add: "Kevlar Vest" x1 @ $200.00

        // Call printAll()
        // Print "Total: $" + formatted totalValue()

    }

}
