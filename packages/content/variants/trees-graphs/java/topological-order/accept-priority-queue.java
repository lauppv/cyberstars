import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int count = in.nextInt(), edges = in.nextInt();
        List<List<Integer>> after = new ArrayList<>();
        for (int v = 0; v < count; v++) after.add(new ArrayList<>());
        int[] waiting = new int[count];
        for (int k = 0; k < edges; k++) {
            int first = in.nextInt(), then = in.nextInt();
            after.get(first).add(then);
            waiting[then]++;
        }
        PriorityQueue<Integer> ready = new PriorityQueue<>();
        for (int v = 0; v < count; v++) if (waiting[v] == 0) ready.add(v);
        StringBuilder plan = new StringBuilder("Order:");
        int placed = 0;
        while (!ready.isEmpty()) {
            int task = ready.poll();
            plan.append(' ').append(task);
            placed++;
            for (int next : after.get(task)) if (--waiting[next] == 0) ready.add(next);
        }
        System.out.println(placed == count ? plan.toString() : "No order, there is a cycle");
    }
}
