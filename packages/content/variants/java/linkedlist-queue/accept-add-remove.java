import java.util.*;

public class Main {
    public static void main(String[] args) {
        String[] events = {"Infernus", "Cheetah", "next", "Stinger", "next", "next", "next"};
        Queue<String> garage = new LinkedList<String>();
        for (int i = 0; i < events.length; i++) {
            if (!events[i].equals("next")) {
                garage.add(events[i]);
                System.out.println("Waiting: " + events[i] + " (" + garage.size() + " in line)");
                continue;
            }
            String car = garage.poll();
            System.out.println(car == null ? "No cars waiting" : "Fixed: " + car);
        }
        System.out.println("Still waiting: " + garage.size());
    }
}
