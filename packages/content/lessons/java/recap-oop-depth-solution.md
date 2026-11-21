```java
import java.util.ArrayList;

record Car(String model, int price) {
}

interface Pricing {
    int finalPrice(int price);
}

class Showroom {
    ArrayList<Car> cars = new ArrayList<>();

    void add(Car car) {
        cars.add(car);
    }

    Car sell(String model) {
        for (int i = 0; i < cars.size(); i++) {
            if (cars.get(i).model().equals(model)) {
                return cars.remove(i);
            }
        }
        return null;
    }

    int value() {
        int total = 0;
        for (Car car : cars) {
            total += car.price();
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] models = { "Infernus", "Cheetah", "Infernus" };
        int[] prices = { 1000, 800, 900 };
        String[] orders = { "Infernus", "Banshee" };
        int discount = 10;

        Showroom showroom = new Showroom();
        for (int i = 0; i < models.length; i++) {
            showroom.add(new Car(models[i], prices[i]));
        }
        Pricing sale = new Pricing() {
            public int finalPrice(int price) {
                return price * (100 - discount) / 100;
            }
        };
        for (String model : orders) {
            Car car = showroom.sell(model);
            if (car == null) {
                System.out.println(model + ": not in stock");
            } else {
                System.out.println("Sold " + model + " for " + sale.finalPrice(car.price()));
            }
        }
        System.out.println("Left: " + showroom.cars);
        System.out.println("Stock value: " + showroom.value());
    }
}
```
