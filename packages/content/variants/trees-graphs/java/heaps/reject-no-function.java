import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] values = {5, 3, 8, 1, 9, 6};
        int pops = 2;

        ArrayList<Integer> heap = new ArrayList<>();
        for (int value : values) {
            heap.add(value);
            int i = heap.size() - 1;
            while (i > 0 && heap.get(i) < heap.get((i - 1) / 2)) {
                int parent = (i - 1) / 2;
                int t = heap.get(i);
                heap.set(i, heap.get(parent));
                heap.set(parent, t);
                i = parent;
            }
        }
        System.out.print("Heap:");
        for (int v : heap) System.out.print(" " + v);
        System.out.println();

        System.out.print("Popped:");
        for (int k = 0; k < pops; k++) {
            System.out.print(" " + heap.get(0));
            int last = heap.remove(heap.size() - 1);
            if (heap.isEmpty()) continue;
            heap.set(0, last);
            int i = 0;
            while (true) {
                int child = i;
                for (int c = 2 * i + 1; c <= 2 * i + 2; c++) {
                    if (c < heap.size() && heap.get(c) < heap.get(child)) child = c;
                }
                if (child == i) break;
                int t = heap.get(i);
                heap.set(i, heap.get(child));
                heap.set(child, t);
                i = child;
            }
        }
        System.out.println();
        System.out.print("Left:");
        for (int v : heap) System.out.print(" " + v);
        System.out.println();
    }
}
