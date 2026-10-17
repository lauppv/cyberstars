import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // adj.get(u) lists {v, w} pairs: a cable between u and v that takes w minutes.
    static int signalTime(ArrayList<ArrayList<int[]>> adj, int s) {
        // Write your code here
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<int[]>> adj = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            int w = scanner.nextInt();
            adj.get(u).add(new int[] {v, w});
            adj.get(v).add(new int[] {u, w});
        }
        int s = scanner.nextInt();
        System.out.println(signalTime(adj, s));
    }
}
