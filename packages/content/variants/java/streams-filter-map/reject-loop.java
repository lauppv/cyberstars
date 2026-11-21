import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] cars = {"Infernus", "Admiral", "Cheetah", "Banshee", "Faggio"};
        int[] speeds = {240, 150, 230, 230, 90};
        int minSpeed = 200;
        ArrayList<Integer> idx = new ArrayList<>();
        for (int i = 0; i < cars.length; i++) if (speeds[i] >= minSpeed) idx.add(i);
        idx.sort((a, b) -> speeds[b] - speeds[a]);
        for (int i : idx) System.out.println(cars[i] + " (" + speeds[i] + " km/h)");
        System.out.println("Fast cars: " + idx.size());
    }
}
