import java.util.ArrayList;

public class Main {
    static class Item {
        String name;
        int quantity;
        double price;
        Item(String n, int q, double p) { name = n; quantity = q; price = p; }
    }

    static class Inventory {
        ArrayList<Item> list = new ArrayList<>();

        void addItem(Item item) { list.add(item); }

        void removeItem(String name) {
            int i = 0;
            while (i < list.size()) {
                if (list.get(i).name.equals(name)) { list.remove(i); return; }
                i++;
            }
        }

        void printAll() {
            for (int i = 0; i < list.size(); i++) {
                Item it = list.get(i);
                System.out.println(it.name + " x" + it.quantity + " @ $" + String.format("%.2f", it.price));
            }
        }

        double totalValue() {
            double sum = 0;
            for (int i = list.size() - 1; i >= 0; i--) sum += list.get(i).price * list.get(i).quantity;
            return sum;
        }
    }

    public static void main(String[] args) {
        String name1 = "Air filter", name2 = "Food pack", name3 = "Repair kit";
        int quantity1 = 4, quantity2 = 10, quantity3 = 3;
        double price1 = 35, price2 = 12, price3 = 85;
        Inventory inv = new Inventory();
        inv.addItem(new Item(name1, quantity1, price1));
        inv.addItem(new Item(name2, quantity2, price2));
        inv.addItem(new Item(name3, quantity3, price3));
        inv.printAll();
        System.out.println("Total: $" + String.format("%.2f", inv.totalValue()));
    }
}
