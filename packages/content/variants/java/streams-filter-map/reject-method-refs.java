import java.util.ArrayList;
import java.util.Comparator;

record Car(String name, int speed) {}

public class Main {
    static int limit;

    static boolean fast(Car c) {
        return c.speed() >= limit;
    }

    static String label(Car c) {
        return c.name() + " (" + c.speed() + " km/h)";
    }

    public static void main(String[] args) {
        String[] cars = {"Infernus", "Admiral", "Cheetah", "Banshee", "Faggio"};
        int[] speeds = {240, 150, 230, 230, 90};
        int minSpeed = 200;

        limit = minSpeed;
        ArrayList<Car> garage = new ArrayList<>();
        for (int i = 0; i < cars.length; i++) {
            garage.add(new Car(cars[i], speeds[i]));
        }

        garage.stream()
            .filter(Main::fast)
            .sorted(Comparator.comparingInt(Car::speed).reversed())
            .map(Main::label)
            .forEach(System.out::println);

        long count = garage.stream().filter(Main::fast).count();
        System.out.println("Fast cars: " + count);
    }
}
