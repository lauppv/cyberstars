import java.util.*;

public class Main {
    static class Task implements Comparable<Task> {
        final String what;
        final int level;
        Task(String what, int level) { this.what = what; this.level = level; }
        @Override
        public int compareTo(Task o) {
            int c = Integer.compare(level, o.level);
            return c != 0 ? c : what.compareTo(o.what);
        }
        @Override
        public String toString() { return level + " - " + what; }
    }

    public static void main(String[] args) {
        String[] jobs = {"Pick up Lance", "Buy a boat", "Pay the cops", "Meet Diaz"};
        int[] urgency = {2, 5, 1, 2};
        Queue<Task> q = new PriorityQueue<Task>();
        for (int i = 0; i < jobs.length; i++) q.add(new Task(jobs[i], urgency[i]));
        Task t;
        while ((t = q.poll()) != null) System.out.println(t);
    }
}
