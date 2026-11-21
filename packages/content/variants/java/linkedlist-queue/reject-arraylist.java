import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] events = {"Infernus", "Cheetah", "next", "Stinger", "next", "next", "next"};
        ArrayList<String> line = new ArrayList<>();
        for (String event : events) {
            if (event.equals("next")) {
                if (line.isEmpty()) System.out.println("No cars waiting");
                else System.out.println("Fixed: " + line.remove(0));
            } else {
                line.add(event);
                System.out.println("Waiting: " + event + " (" + line.size() + " in line)");
            }
        }
        System.out.println("Still waiting: " + line.size());
    }
}
