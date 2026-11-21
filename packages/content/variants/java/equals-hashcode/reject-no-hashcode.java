import java.util.ArrayList;
import java.util.HashMap;

class Car {
    String model;
    int year;

    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Car)) return false;
        Car car = (Car) other;
        return model.equals(car.model) && year == car.year;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] models = { "Infernus", "Cheetah", "Infernus", "Infernus" };
        int[] years = { 1986, 1986, 1986, 1985 };
        HashMap<Car, Integer> counts = new HashMap<>();
        ArrayList<Car> different = new ArrayList<>();
        for (int i = 0; i < models.length; i++) {
            Car car = new Car(models[i], years[i]);
            if (!different.contains(car)) different.add(car);
            counts.put(car, counts.getOrDefault(car, 0) + 1);
        }
        for (Car car : different) System.out.println(car.model + " " + car.year + ": " + counts.get(car));
        System.out.println("Different cars: " + different.size());
    }
}
