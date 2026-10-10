public class Main {
    static int visit(int shop, int closed, int police, int total) {
        if (shop == closed) {
            return 0;
        }
        System.out.println("Shop " + shop);
        return shop;
    }

    public static void main(String[] args) {
        int totalShops = 6;
        int closedShop = 3;
        int policeShop = 5;

        int total = 0;
        for (int shop = 1; shop <= totalShops; shop++) {
            if (shop == policeShop) {
                break;
            }
            if (shop == closedShop) {
                continue;
            }
            total += visit(shop, closedShop, policeShop, total);
        }
        System.out.println("Total: " + total);
    }
}
