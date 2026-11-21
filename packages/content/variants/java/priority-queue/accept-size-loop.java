import java.util.PriorityQueue;

class Job implements Comparable<Job> {
    String name;
    int urgency;
    Job(String name, int urgency) { this.name = name; this.urgency = urgency; }
    public int compareTo(Job other) {
        if (urgency < other.urgency) return -1;
        if (urgency > other.urgency) return 1;
        return name.compareTo(other.name);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] jobs = {"Pick up Lance", "Buy a boat", "Pay the cops", "Meet Diaz"};
        int[] urgency = {2, 5, 1, 2};
        PriorityQueue<Job> pq = new PriorityQueue<>();
        int i = jobs.length - 1;
        while (i >= 0) { pq.offer(new Job(jobs[i], urgency[i])); i--; }
        int n = pq.size();
        for (int k = 0; k < n; k++) {
            Job j = pq.poll();
            System.out.println(j.urgency + " - " + j.name);
        }
    }
}
