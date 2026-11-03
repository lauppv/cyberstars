import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 1; j++) heap.add(in.nextInt());
        }
        StringBuilder out = new StringBuilder();
        while (!heap.isEmpty()) out.append(out.length() > 0 ? " " : "").append(heap.poll());
        System.out.println(out);
    }
}
