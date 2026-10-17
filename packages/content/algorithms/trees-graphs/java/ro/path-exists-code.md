import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    // vecini.get(u) are vecinii nodului u.
    static boolean existaDrum(ArrayList<ArrayList<Integer>> vecini, int s, int t) {
        // Scrie codul tau aici
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            vecini.get(v).add(u);
        }
        int s = scanner.nextInt();
        int t = scanner.nextInt();
        System.out.println(existaDrum(vecini, s, t));
    }
}
