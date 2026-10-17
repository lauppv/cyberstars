import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // adj.get(u) lists the neighbours of vertex u.
    static void visit(ArrayList<ArrayList<Integer>> adj, boolean[] seen, int u) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                visit(adj, seen, v);
            }
        }
    }

    static boolean pathExists(ArrayList<ArrayList<Integer>> adj, int s, int t) {
        boolean[] seen = new boolean[adj.size()];
        visit(adj, seen, s);
        return seen[t];
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
            adj.get(v).add(u);
        }
        int s = scanner.nextInt();
        int t = scanner.nextInt();
        System.out.println(pathExists(adj, s, t));
    }
}
