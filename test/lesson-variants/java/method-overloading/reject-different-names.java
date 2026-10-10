public class Main {
    static void describeName(String name) {
        System.out.println("Weapon: " + name);
    }

    static void describeCount(String name, int quantity) {
        System.out.println("Weapon: " + name + " - " + quantity + " ordered");
    }

    static void describeTotal(String name, int quantity, int price) {
        System.out.println("Weapon: " + name + " - $" + price + " x " + quantity + " ordered - $" + (price * quantity));
    }

    public static void main(String[] args) {
        String weapon = "Sniper";
        int quantity = 4;
        int price = 10;
        describeName(weapon);
        describeCount(weapon, quantity);
        describeTotal(weapon, quantity, price);
    }
}
