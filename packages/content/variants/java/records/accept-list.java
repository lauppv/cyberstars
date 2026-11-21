import java.util.ArrayList;

record Sale(String item, int price, int quantity) {
    int total() { return price() * quantity(); }
}

public class Main {
    public static void main(String[] args) {
        String[] items = { "Pistol", "Shotgun" };
        int[] prices = { 100, 450 };
        int[] quantities = { 3, 1 };
        ArrayList<Sale> book = new ArrayList<>();
        for (int i = 0; i < items.length; i++) book.add(new Sale(items[i], prices[i], quantities[i]));
        int sum = 0;
        for (Sale s : book) {
            System.out.println(s.toString() + " -> " + s.total());
            sum += s.total();
        }
        System.out.println("Night total: " + sum);
    }
}
