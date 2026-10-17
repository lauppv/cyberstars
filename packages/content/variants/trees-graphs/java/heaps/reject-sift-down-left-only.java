import java.util.ArrayList;

public class Main {
    static void swap(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void heapPush(ArrayList<Integer> heap, int value) {
        heap.add(value);
        int i = heap.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap.get(i) < heap.get(parent)) {
                swap(heap, i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    static int heapPop(ArrayList<Integer> heap) {
        int smallest = heap.get(0);
        int last = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, last);
            int i = 0;
            while (true) {
                int left = 2 * i + 1;
                int right = 2 * i + 2;
                int child = i;
                if (left < heap.size() && heap.get(left) < heap.get(child)) {
                    child = left;
                }
                if (child == i) {
                    break;
                }
                swap(heap, i, child);
                i = child;
            }
        }
        return smallest;
    }

    public static void main(String[] args) {
        int[] values = {5, 3, 8, 1, 9, 6};
        int pops = 2;

        ArrayList<Integer> heap = new ArrayList<>();
        for (int value : values) {
            heapPush(heap, value);
        }

        System.out.print("Heap: ");
        for (int value : heap) {
            System.out.print(value + " ");
        }
        System.out.println();

        System.out.print("Popped: ");
        for (int i = 0; i < pops; i++) {
            System.out.print(heapPop(heap) + " ");
        }
        System.out.println();

        System.out.print("Left: ");
        for (int value : heap) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
}
