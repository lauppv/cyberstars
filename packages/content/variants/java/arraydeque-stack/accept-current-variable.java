import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        String[] moves = {"Ocean Beach", "Little Havana", "Downtown", "back", "back", "back"};
        Deque<String> before = new ArrayDeque<>();
        String current = null;
        for (String move : moves) {
            if (move.equals("back")) {
                if (before.isEmpty()) {
                    System.out.println("Nowhere to go back to");
                } else {
                    current = before.pop();
                    System.out.println("Back at " + current);
                }
            } else {
                if (current != null) before.push(current);
                current = move;
                System.out.println("Drive to " + move);
            }
        }
        System.out.println("Now at: " + (current == null ? "nowhere" : current));
    }
}
