import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        String[] events = {"Infernus", "Cheetah", "next", "Stinger", "next", "next", "next"};
        LinkedList<String> cars = new LinkedList<>();
        int k = 0;
        while (k < events.length) {
            String e = events[k++];
            if ("next".equals(e)) {
                if (cars.size() > 0) System.out.println("Fixed: " + cars.removeFirst());
                else System.out.println("No cars waiting");
            } else {
                cars.addLast(e);
                System.out.println("Waiting: " + e + " (" + cars.size() + " in line)");
            }
        }
        System.out.println("Still waiting: " + cars.size());
    }
}
