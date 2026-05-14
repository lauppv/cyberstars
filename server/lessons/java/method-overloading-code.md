public class Main {
    // Version 1: just the item name
    public static void describe(String item) {
        // print "Item: X"
    }

    // Version 2: item name and quantity
    public static void describe(String item, int quantity) {
        // print "Item: X (x5)"
    }

    // Version 3: item name, quantity, and price
    public static void describe(String item, int quantity, double price) {
        // print "Item: X (x5) - $P"
    }

    public static void main(String[] args) {
        describe("Sword");
        describe("Shield", 5);
        describe("Potion", 3, 9.99);
    }
}
