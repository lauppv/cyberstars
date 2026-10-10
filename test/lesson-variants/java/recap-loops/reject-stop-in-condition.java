public class Main {
    static int collect(int shop) {
        System.out.println("Shop " + shop);
        return shop;
    }

    public static void main(String[] args) {
        int totalShops = 6;
        int closedShop = 3;
        int policeShop = 5;

        int last = Math.min(totalShops, policeShop - 1);
        int money = 0;
        for (int i = 1; i <= last; i++) {
            if (i != closedShop) {
                money += collect(i);
            }
        }
        System.out.println("Total: " + money);
    }
}
