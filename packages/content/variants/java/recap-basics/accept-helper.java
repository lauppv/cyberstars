public class Main {
    static String line(String label, double amount) {
        return label + ": " + String.format("%.2f", amount) + " EUR";
    }

    public static void main(String[] args) {
        String product1 = "Oxygen module";
        double price1 = 999.99;
        String product2 = "Water filter";
        double price2 = 29.50;
        String product3 = "Solar battery";
        double price3 = 5.99;
        int tax = 19;

        double[] prices = { price1, price2, price3 };
        double sub = 0;
        for (double p : prices) {
            sub += p;
        }
        double t = sub * tax / 100;
        StringBuilder out = new StringBuilder("Supply receipt\n");
        out.append(line(product1, price1)).append('\n');
        out.append(line(product2, price2)).append('\n');
        out.append(line(product3, price3)).append('\n');
        out.append(line("Subtotal", sub)).append('\n');
        out.append(line("Tax (" + tax + "%)", t)).append('\n');
        out.append(line("Total", sub + t));
        System.out.println(out);
    }
}
