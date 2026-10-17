import java.util.Scanner;

public class Main {
    static boolean[][] joined;
    static int[] group;

    static void mark(int v, int id) {
        group[v] = id;
        for (int w = 0; w < joined.length; w++) {
            if (joined[v][w] && group[w] == 0) mark(w, id);
        }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int size = in.nextInt(), edges = in.nextInt();
        joined = new boolean[size][size];
        group = new int[size];
        for (int k = 0; k < edges; k++) {
            int a = in.nextInt(), b = in.nextInt();
            joined[a][b] = joined[b][a] = true;
        }
        int groups = 0;
        for (int v = 0; v < size; v++) if (group[v] == 0) mark(v, ++groups);
        StringBuilder out = new StringBuilder("Pieces: " + groups + "\n");
        for (int id = 1; id <= groups; id++) {
            out.append("Piece ").append(id).append(":");
            for (int v = 0; v < size; v++) if (group[v] == id) out.append(" ").append(v);
            out.append("\n");
        }
        System.out.print(out);
    }
}
