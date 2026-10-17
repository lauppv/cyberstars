import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int e = 5;
        int f = 6;
        int g = 7;
        int[] val = {a, b, c, d, e, f, g};
        int[] left = {1, 3, 4, -1, -1, -1, -1};
        int[] right = {2, -1, 5, -1, 6, -1, -1};
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(0);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            System.out.print("Level " + level + ": ");
            for (int i = 0; i < size; i++) {
                int n = queue.poll();
                System.out.print(val[n] + " ");
                if (left[n] >= 0) queue.add(left[n]);
                if (right[n] >= 0) queue.add(right[n]);
            }
            System.out.println();
            level++;
        }
    }
}
