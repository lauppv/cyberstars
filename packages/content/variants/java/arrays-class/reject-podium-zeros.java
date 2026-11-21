import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] times = { 61, 58, 70, 55 };
        int[] sorted = Arrays.copyOf(times, times.length);
        Arrays.sort(sorted);
        int[] podium = Arrays.copyOf(sorted, 3);
        System.out.println("Start order: " + Arrays.toString(times));
        System.out.println("Sorted: " + Arrays.toString(sorted));
        System.out.println("Podium: " + Arrays.toString(podium));
    }
}
