public class Main {
    public static void main(String[] args) {
        int totalShops = 6;
        int closedShop = 3;
        int policeShop = 5;

        int sum = 0;
        int s = 0;
        while (s < totalShops) {
            s++;
            if (s == closedShop) continue;
            if (s == policeShop) break;
            System.out.println("Shop " + s);
            sum += s;
        }
        System.out.println("Total: " + sum);
    }
}
