import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] moves = {"Ocean Beach", "Little Havana", "Downtown", "back", "back", "back"};
        ArrayList<String> places = new ArrayList<>();
        for (String move : moves) {
            if (move.equals("back")) {
                if (places.size() < 2) {
                    System.out.println("Nowhere to go back to");
                } else {
                    places.remove(places.size() - 1);
                    System.out.println("Back at " + places.get(places.size() - 1));
                }
            } else {
                places.add(move);
                System.out.println("Drive to " + move);
            }
        }
        System.out.println("Now at: " + (places.isEmpty() ? "nowhere" : places.get(places.size() - 1)));
    }
}
