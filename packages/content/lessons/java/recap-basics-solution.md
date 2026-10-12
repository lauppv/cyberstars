```java
public class Main {
    public static void main(String[] args) {
        String product1 = "Oxygen module";
        double price1 = 999.99;
        String product2 = "Water filter";
        double price2 = 29.50;
        String product3 = "Solar battery";
        double price3 = 5.99;
        int tax = 19;

        double subtotal = price1 + price2 + price3;
        double taxAmount = subtotal * tax / 100;
        double total = subtotal + taxAmount;

        System.out.println("Supply receipt");
        System.out.println(product1 + ": " + String.format("%.2f", price1) + " EUR");
        System.out.println(product2 + ": " + String.format("%.2f", price2) + " EUR");
        System.out.println(product3 + ": " + String.format("%.2f", price3) + " EUR");
        System.out.println("Subtotal: " + String.format("%.2f", subtotal) + " EUR");
        System.out.println("Tax (" + tax + "%): " + String.format("%.2f", taxAmount) + " EUR");
        System.out.println("Total: " + String.format("%.2f", total) + " EUR");
    }
}
```
