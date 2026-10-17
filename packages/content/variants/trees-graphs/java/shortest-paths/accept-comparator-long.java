import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int size = in.nextInt(), edges = in.nextInt();
        long[][] length = new long[size][size];
        for (int k = 0; k < edges; k++) {
            int a = in.nextInt(), b = in.nextInt();
            length[a][b] = length[b][a] = in.nextInt();
        }
        int source = in.nextInt();
        long[] best = new long[size];
        Arrays.fill(best, Long.MAX_VALUE);
        best[source] = 0;
        PriorityQueue<long[]> frontier = new PriorityQueue<>(Comparator.comparingLong(p -> p[0]));
        frontier.add(new long[] {0, source});
        boolean[] settled = new boolean[size];
        while (!frontier.isEmpty()) {
            long[] next = frontier.poll();
            int here = (int) next[1];
            if (settled[here]) continue;
            settled[here] = true;
            for (int there = 0; there < size; there++) {
                if (length[here][there] > 0 && best[here] + length[here][there] < best[there]) {
                    best[there] = best[here] + length[here][there];
                    frontier.add(new long[] {best[there], there});
                }
            }
        }
        for (int v = 0; v < size; v++) {
            System.out.println(v + ": " + (best[v] == Long.MAX_VALUE ? -1 : best[v]));
        }
    }
}
