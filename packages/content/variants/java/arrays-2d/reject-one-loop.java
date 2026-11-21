import java.util.Arrays;
import java.util.stream.IntStream;

public class Main {
    public static void main(String[] args) {
        int[][] vault = { { 100, 500, 20 }, { 0, 900, 50 } };

        int bestFloor = 0;
        int bestSafe = 0;
        for (int floor = 0; floor < vault.length; floor++) {
            int[] safes = vault[floor];
            System.out.println("Floor " + (floor + 1) + ": " + Arrays.stream(safes).sum());
            int top = Arrays.stream(safes).max().orElse(Integer.MIN_VALUE);
            if (top > vault[bestFloor][bestSafe]) {
                bestFloor = floor;
                bestSafe = IntStream.range(0, safes.length).filter(i -> safes[i] == top).findFirst().getAsInt();
            }
        }
        System.out.println("Best safe: floor " + (bestFloor + 1) + ", safe " + (bestSafe + 1) + ", cash " + vault[bestFloor][bestSafe]);
    }
}
