import java.util.ArrayList;

record Car(String name, int speed) {}

public class Main {
    public static void main(String[] args) {
        String[] cars = {"Infernus", "Admiral", "Cheetah", "Banshee", "Faggio"};
        int[] speeds = {240, 150, 230, 230, 90};
        int minSpeed = 200;
        ArrayList<Car> garage = new ArrayList<>();
        for (int i = 0; i < cars.length; i++) garage.add(new Car(cars[i], speeds[i]));
        garage.stream().filter(c -> c.speed() > minSpeed).sorted((a, b) -> b.speed() - a.speed())
            .forEach(c -> System.out.println(c.name() + " (" + c.speed() + " km/h)"));
        System.out.println("Fast cars: " + garage.stream().filter(c -> c.speed() > minSpeed).count());
    }
}
