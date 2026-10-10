public class Main {
    public static void describe(String item) {
        System.out.printf("Weapon: %s%n", item);
    }

    public static void describe(String item, int pieces) {
        System.out.printf("Weapon: %s - %d ordered%n", item, pieces);
    }

    public static void describe(String item, int pieces, int cost) {
        int sum = 0;
        for (int i = 0; i < pieces; i++) {
            sum += cost;
        }
        System.out.printf("Weapon: %s - $%d x %d ordered - $%d%n", item, cost, pieces, sum);
    }

    public static void main(String[] args) {
        int quantity = 4;
        int price = 10;
        String weapon = "Sniper";
        describe(weapon);
        describe(weapon, quantity);
        describe(weapon, quantity, price);
    }
}
