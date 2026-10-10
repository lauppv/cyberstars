public class Main {
    static void describe(String name) {
        System.out.println("Weapon: " + name);
    }

    static void describe(String name, int quantity) {
        System.out.println("Weapon: " + name + " - " + quantity + " ordered");
    }

    static void describe(String name, int quantity, int price) {
        System.out.println("Weapon: " + name + " - $" + price + " x " + quantity + " ordered - $" + (price + quantity * 9));
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
