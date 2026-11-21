import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] times = { 61, 58, 70, 55 };
        System.out.println("Start order: " + Arrays.toString(times));
        int[] sorted = Arrays.copyOf(times, times.length);
        Arrays.sort(sorted);
        System.out.println("Sorted: " + Arrays.toString(sorted));
        int size = sorted.length < 3 ? sorted.length : 3;
        System.out.println("Podium: " + Arrays.toString(Arrays.copyOf(sorted, size)));
    }
}
