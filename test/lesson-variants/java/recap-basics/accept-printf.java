public class Main {
    public static void main(String[] args) {
        String product1 = "Oxygen module";
        double price1 = 999.99;
        String product2 = "Water filter";
        double price2 = 29.50;
        String product3 = "Solar battery";
        double price3 = 5.99;
        int tax = 19;

        double sum = price1 + price2 + price3;
        double vat = sum * (tax / 100.0);
        System.out.println("Supply receipt");
        System.out.printf("%s: %.2f EUR%n", product1, price1);
        System.out.printf("%s: %.2f EUR%n", product2, price2);
        System.out.printf("%s: %.2f EUR%n", product3, price3);
        System.out.printf("Subtotal: %.2f EUR%n", sum);
        System.out.printf("Tax (%d%%): %.2f EUR%n", tax, vat);
        System.out.printf("Total: %.2f EUR%n", sum + vat);
    }
}
