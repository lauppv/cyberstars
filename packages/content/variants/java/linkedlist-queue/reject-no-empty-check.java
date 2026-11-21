import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        String[] events = {"Infernus", "Cheetah", "next", "Stinger", "next", "next", "next"};
        Queue<String> line = new LinkedList<>();
        for (String event : events) {
            if (event.equals("next")) {
                System.out.println("Fixed: " + line.poll());
            } else {
                line.offer(event);
                System.out.println("Waiting: " + event + " (" + line.size() + " in line)");
            }
        }
        System.out.println("Still waiting: " + line.size());
    }
}
