import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // adj.get(u) lists the courses that need u first.
    static ArrayList<Integer> courseOrder(ArrayList<ArrayList<Integer>> adj) {
        int n = adj.size();
        int[] indeg = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) {
                indeg[v]++;
            }
        }
        ArrayDeque<Integer> ready = new ArrayDeque<>();
        for (int v = 0; v < n; v++) {
            if (indeg[v] == 0) {
                ready.add(v);
            }
        }
        ArrayList<Integer> order = new ArrayList<>();
        while (!ready.isEmpty()) {
            int u = ready.remove();
            order.add(u);
            for (int v : adj.get(u)) {
                indeg[v]--;
                if (indeg[v] == 0) {
                    ready.add(v);
                }
            }
        }
        if (order.size() < n) {
            return new ArrayList<>();
        }
        return order;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            adj.get(u).add(v);
        }
        ArrayList<Integer> order = courseOrder(adj);
        if (order.isEmpty()) {
            System.out.println(-1);
            return;
        }
        StringBuilder line = new StringBuilder();
        for (int i = 0; i < order.size(); i++) {
            if (i > 0) {
                line.append(' ');
            }
            line.append(order.get(i));
        }
        System.out.println(line);
    }
}
