import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // adj.get(u) lists the neighbours of vertex u.
    static int countGroups(ArrayList<ArrayList<Integer>> adj) {
        // Write your code here
        return 0;
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
        System.out.println(countGroups(adj));
    }
}
