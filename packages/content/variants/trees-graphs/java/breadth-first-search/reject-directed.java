import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

public class Main {
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
        int s = scanner.nextInt();
        int t = scanner.nextInt();

        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[s] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(s);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    queue.add(v);
                }
            }
        }

        for (int v = 0; v < n; v++) {
            System.out.println(v + ": " + dist[v]);
        }
        if (dist[t] == -1) {
            System.out.println("No way from " + s + " to " + t);
        } else {
            System.out.println("Fewest steps from " + s + " to " + t + ": " + dist[t]);
        }
    }
}
