import java.util.*;

public class Main {
    static class Ride {
        String n; int s;
        Ride(String n, int s) { this.n = n; this.s = s; }
    }

    public static void main(String[] args) {
        String[] cars = {"Infernus", "Admiral", "Cheetah", "Banshee", "Faggio"};
        int[] speeds = {240, 150, 230, 230, 90};
        int minSpeed = 200;
        List<Ride> all = new ArrayList<>();
        for (int i = 0; i < cars.length; i++) all.add(new Ride(cars[i], speeds[i]));
        List<Ride> fast = all.stream()
            .filter(r -> r.s >= minSpeed)
            .sorted((a, b) -> Integer.compare(b.s, a.s))
            .toList();
        for (Ride r : fast) System.out.println(r.n + " (" + r.s + " km/h)");
        System.out.println("Fast cars: " + fast.size());
    }
}
