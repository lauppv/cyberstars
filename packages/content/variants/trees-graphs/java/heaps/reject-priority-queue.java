import java.util.PriorityQueue;

public class Main {
    static void print(String label, Iterable<Integer> items) {
        System.out.print(label);
        for (int v : items) System.out.print(" " + v);
        System.out.println();
    }

    public static void main(String[] args) {
        int[] values = {5, 3, 8, 1, 9, 6};
        int pops = 2;

        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int v : values) heap.add(v);
        print("Heap:", heap);
        System.out.print("Popped:");
        for (int i = 0; i < pops; i++) System.out.print(" " + heap.poll());
        System.out.println();
        print("Left:", heap);
    }
}
