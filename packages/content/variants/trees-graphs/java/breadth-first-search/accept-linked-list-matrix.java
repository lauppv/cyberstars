import java.util.LinkedList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int count = in.nextInt();
        int edges = in.nextInt();
        boolean[][] joined = new boolean[count][count];
        for (int k = 0; k < edges; k++) {
            int a = in.nextInt();
            int b = in.nextInt();
            joined[a][b] = joined[b][a] = true;
        }
        int source = in.nextInt();
        int target = in.nextInt();

        Integer[] steps = new Integer[count];
        steps[source] = 0;
        LinkedList<Integer> waiting = new LinkedList<>();
        waiting.add(source);
        while (waiting.size() > 0) {
            int here = waiting.poll();
            for (int there = 0; there < count; there++) {
                if (joined[here][there] && steps[there] == null) {
                    steps[there] = steps[here] + 1;
                    waiting.add(there);
                }
            }
        }
        for (int v = 0; v < count; v++) {
            System.out.println(v + ": " + (steps[v] == null ? -1 : steps[v]));
        }
        System.out.println(steps[target] == null
                ? "No way from " + source + " to " + target
                : "Fewest steps from " + source + " to " + target + ": " + steps[target]);
    }
}
