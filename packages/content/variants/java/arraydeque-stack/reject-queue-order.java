import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        String[] moves = {"Ocean Beach", "Little Havana", "Downtown", "back", "back", "back"};
        Deque<String> places = new ArrayDeque<>();
        for (String move : moves) {
            if (move.equals("back")) {
                if (places.size() < 2) {
                    System.out.println("Nowhere to go back to");
                } else {
                    places.pollFirst();
                    System.out.println("Back at " + places.peekFirst());
                }
            } else {
                places.addLast(move);
                System.out.println("Drive to " + move);
            }
        }
        System.out.println("Now at: " + (places.isEmpty() ? "nowhere" : places.peekLast()));
    }
}
