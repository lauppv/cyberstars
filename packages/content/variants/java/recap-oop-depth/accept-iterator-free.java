import java.util.ArrayList;

record Car(String model, int price) {}

interface Pricing {
    int finalPrice(int price);
}

class Showroom {
    private final ArrayList<Car> stock = new ArrayList<>();

    void add(Car car) { stock.add(car); }

    Car sell(String model) {
        Car found = null;
        for (Car car : stock) {
            if (car.model().equals(model)) { found = car; break; }
        }
        if (found != null) stock.remove(found);
        return found;
    }

    ArrayList<Car> left() { return stock; }

    int total() {
        int sum = 0;
        for (Car car : stock) sum += car.price();
        return sum;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] models = { "Infernus", "Cheetah", "Infernus" };
        int[] prices = { 1000, 800, 900 };
        String[] orders = { "Infernus", "Banshee" };
        int discount = 10;
        Showroom shop = new Showroom();
        for (int i = 0; i < models.length; i++) shop.add(new Car(models[i], prices[i]));
        Pricing pricing = new Pricing() {
            @Override
            public int finalPrice(int price) { return price * (100 - discount) / 100; }
        };
        for (String wanted : orders) {
            Car car = shop.sell(wanted);
            System.out.println(car != null ? "Sold " + wanted + " for " + pricing.finalPrice(car.price()) : wanted + ": not in stock");
        }
        System.out.println("Left: " + shop.left());
        System.out.println("Stock value: " + shop.total());
    }
}
