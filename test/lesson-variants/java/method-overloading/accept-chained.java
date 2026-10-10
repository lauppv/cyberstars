public class Main {
    static void describe(String w) {
        System.out.println(label(w));
    }

    static void describe(String w, int n) {
        System.out.println(label(w) + " - " + n + " ordered");
    }

    static void describe(String w, int n, int unit) {
        System.out.println(label(w) + " - $" + unit + " x " + n + " ordered - $" + (n * unit));
    }

    static String label(String w) {
        return "Weapon: " + w;
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
