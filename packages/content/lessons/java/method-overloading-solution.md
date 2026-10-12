```java
public class Main {
    public static void describe(String name) {
        System.out.println("Weapon: " + name);
    }

    public static void describe(String name, int quantity) {
        System.out.println("Weapon: " + name + " - " + quantity + " ordered");
    }

    public static void describe(String name, int quantity, int price) {
        int total = price * quantity;
        System.out.println("Weapon: " + name + " - $" + price + " x " + quantity + " ordered - $" + total);
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
```
