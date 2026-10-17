public class Main {
    static int[] heap = new int[16];
    static int size = 0;

    static void push(int x) {
        int k = size++;
        heap[k] = x;
        while (k > 0 && heap[(k - 1) / 2] > heap[k]) {
            int up = (k - 1) / 2;
            int t = heap[up];
            heap[up] = heap[k];
            heap[k] = t;
            k = up;
        }
    }

    static int pop() {
        int top = heap[0];
        heap[0] = heap[--size];
        int k = 0;
        while (true) {
            int best = k;
            for (int c = 2 * k + 1; c <= 2 * k + 2; c++) {
                if (c < size && heap[c] < heap[best]) best = c;
            }
            if (best == k) return top;
            int t = heap[best];
            heap[best] = heap[k];
            heap[k] = t;
            k = best;
        }
    }

    static void show(String label) {
        StringBuilder line = new StringBuilder(label);
        for (int i = 0; i < size; i++) line.append(' ').append(heap[i]);
        System.out.println(line);
    }

    public static void main(String[] args) {
        int[] values = {5, 3, 8, 1, 9, 6};
        int pops = 2;

        for (int x : values) push(x);
        show("Heap:");
        StringBuilder out = new StringBuilder("Popped:");
        for (int i = 0; i < pops; i++) out.append(' ').append(pop());
        System.out.println(out);
        show("Left:");
    }
}
