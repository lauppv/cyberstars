import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] times = { 61, 58, 70, 55 };
        int[] sorted = times;
        Arrays.sort(sorted);
        int[] podium = Arrays.copyOf(sorted, Math.min(3, sorted.length));
        System.out.println("Start order: " + Arrays.toString(times));
        System.out.println("Sorted: " + Arrays.toString(sorted));
        System.out.println("Podium: " + Arrays.toString(podium));
    }
}
