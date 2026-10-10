public class Main {
    static void describe(String weapon, int... details) {
        String line = "Weapon: " + weapon;
        if (details.length == 1) {
            line += " - " + details[0] + " ordered";
        } else if (details.length == 2) {
            line += " - $" + details[1] + " x " + details[0] + " ordered - $" + (details[0] * details[1]);
        }
        System.out.println(line);
    }

    public static void main(String[] args) {
        String weapon = "Sniper";
        int quantity = 4;
        int price = 10;
        describe(weapon);
        describe(weapon, quantity);
        describe(weapon, quantity, price);
    }
}
