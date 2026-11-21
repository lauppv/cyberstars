import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        String[] events = {"Infernus", "Cheetah", "next", "Stinger", "next", "next", "next"};
        LinkedList<String> cars = new LinkedList<>();
        for (String e : events) {
            if (e.equals("next")) {
                if (cars.isEmpty()) System.out.println("No cars waiting");
                else System.out.println("Fixed: " + cars.removeLast());
            } else {
                cars.add(e);
                System.out.println("Waiting: " + e + " (" + cars.size() + " in line)");
            }
        }
        System.out.println("Still waiting: " + cars.size());
    }
}
