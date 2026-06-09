public class Main {
    public static void describe(String item) {
    }

    public static void describe(String item, int quantity) {
    }

    public static void describe(String item, int quantity, double price) {
    }

    public static void main(String[] args) {
        describe("Sword");
        describe("Shield", 5);
        describe("Potion", 3, 9.99);
    }
}
