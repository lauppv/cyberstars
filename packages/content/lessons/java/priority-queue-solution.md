```java
import java.util.PriorityQueue;

class Job implements Comparable<Job> {
    String name;
    int urgency;

    Job(String name, int urgency) {
        this.name = name;
        this.urgency = urgency;
    }

    public int compareTo(Job other) {
        if (this.urgency != other.urgency) {
            return this.urgency - other.urgency;
        }
        return this.name.compareTo(other.name);
    }
}

public class Main {
    public static void main(String[] args) {
        String[] jobs = {"Pick up Lance", "Buy a boat", "Pay the cops", "Meet Diaz"};
        int[] urgency = {2, 5, 1, 2};

        PriorityQueue<Job> tonight = new PriorityQueue<>();
        for (int i = 0; i < jobs.length; i++) {
            tonight.offer(new Job(jobs[i], urgency[i]));
        }

        while (!tonight.isEmpty()) {
            Job job = tonight.poll();
            System.out.println(job.urgency + " - " + job.name);
        }
    }
}
```
