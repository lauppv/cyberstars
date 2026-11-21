```java
record Sale(String item, int price, int quantity) {
    int total() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] items = { "Pistol", "Shotgun" };
        int[] prices = { 100, 450 };
        int[] quantities = { 3, 1 };

        int night = 0;
        for (int i = 0; i < items.length; i++) {
            Sale sale = new Sale(items[i], prices[i], quantities[i]);
            System.out.println(sale + " -> " + sale.total());
            night += sale.total();
        }
        System.out.println("Night total: " + night);
    }
}
```
