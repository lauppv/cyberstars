import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;

class Car {
    private final String model;
    private final int year;

    Car(String model, int year) {
        this.model = model;
        this.year = year;
    }

    String label() {
        return model + " " + year;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Car other = (Car) o;
        return year == other.year && Objects.equals(model, other.model);
    }

    public int hashCode() {
        return model.hashCode() * 31 + year;
    }
}

public class Main {
    public static void main(String[] args) {
        String[] models = { "Infernus", "Cheetah", "Infernus", "Infernus" };
        int[] years = { 1986, 1986, 1986, 1985 };
        HashMap<Car, Integer> counts = new HashMap<>();
        ArrayList<Car> seen = new ArrayList<>();
        for (int i = 0; i < models.length; i++) {
            Car car = new Car(models[i], years[i]);
            if (!seen.contains(car)) seen.add(car);
            counts.put(car, counts.containsKey(car) ? counts.get(car) + 1 : 1);
        }
        for (Car car : seen) System.out.println(car.label() + ": " + counts.get(car));
        System.out.println("Different cars: " + seen.size());
    }
}
