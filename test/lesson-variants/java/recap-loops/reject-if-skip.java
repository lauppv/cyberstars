public class Main {
    public static void main(String[] args) {
        int totalShops = 6;
        int closedShop = 3;
        int policeShop = 5;

        int total = 0;
        for (int shop = 1; shop <= totalShops; shop++) {
            if (shop == policeShop) {
                break;
            }
            if (shop != closedShop) {
                System.out.println("Shop " + shop);
                total += shop;
            }
        }
        System.out.println("Total: " + total);
    }
}
